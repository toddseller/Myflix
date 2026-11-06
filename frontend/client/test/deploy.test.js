// @vitest-environment node
import { execFileSync, spawnSync } from 'node:child_process'
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Runs bin/deploy against a throwaway origin and server checkout, with docker and curl replaced by recorders, so
// every decision the script makes can be checked without touching the real server. Ported from MMDb's deploy spec.
const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '../../../bin/deploy')

vi.setConfig({ testTimeout: 20000 })

let root
const seed = () => join(root, 'seed')
const server = () => join(root, 'server')
const dockerLog = () => join(root, 'docker.log')
const curlLog = () => join(root, 'curl.log')

// Keeps the developer's global git settings (signing, hooks) out of the throwaway repositories.
const isolated = () => ({
  ...process.env,
  HOME: root,
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_AUTHOR_NAME: 'Deploy Test',
  GIT_AUTHOR_EMAIL: 'deploy@example.test',
  GIT_COMMITTER_NAME: 'Deploy Test',
  GIT_COMMITTER_EMAIL: 'deploy@example.test'
})
const git = (dir, ...args) => execFileSync('git', ['-C', dir, ...args], { env: isolated(), encoding: 'utf8', stdio: 'pipe' }).trim()

const commit = (files, message = 'change') => {
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(dirname(join(seed(), path)), { recursive: true })
    writeFileSync(join(seed(), path), body)
  }
  git(seed(), 'add', '--all')
  git(seed(), 'commit', '--quiet', '-m', message)
  return git(seed(), 'rev-parse', 'HEAD')
}

// Commits on master in origin and tags the result, as a merged change would be.
const release = (tag, files) => {
  const sha = commit(files)
  git(seed(), 'tag', tag)
  git(seed(), 'push', '--quiet', 'origin', 'master', tag)
  return sha
}

const writeStandIns = () => {
  const bin = join(root, 'fake-bin')
  mkdirSync(bin)
  // "image inspect" answers as if an image exists, unless the test says there is none yet.
  writeFileSync(join(bin, 'docker'), `#!/bin/sh\necho "$*" >> '${ dockerLog() }'\n[ "$1 $2" != "image inspect" ] || [ -z "$FAKE_NO_IMAGE" ]\n`)
  writeFileSync(join(bin, 'curl'), `#!/bin/sh\necho "$*" >> '${ curlLog() }'\nprintf '%s' "\${FAKE_HTTP_STATUS:-200}"\n[ "\${FAKE_HTTP_STATUS:-200}" = 200 ]\n`)
  chmodSync(join(bin, 'docker'), 0o755)
  chmodSync(join(bin, 'curl'), 0o755)
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'deploy-test-'))
  git(root, 'init', '--quiet', '--bare', '--initial-branch=master', 'origin.git')
  git(root, 'clone', '--quiet', join(root, 'origin.git'), 'seed')
  mkdirSync(join(seed(), 'bin'))
  if (existsSync(SCRIPT)) {
    copyFileSync(SCRIPT, join(seed(), 'bin', 'deploy'))
    chmodSync(join(seed(), 'bin', 'deploy'), 0o755)
  }
  commit({ 'frontend/client/app.js': "'v1'\n" })
  git(seed(), 'push', '--quiet', 'origin', 'master')
  git(root, 'clone', '--quiet', join(root, 'origin.git'), 'server')
  writeStandIns()
})
afterEach(() => rmSync(root, { recursive: true, force: true }))

const deploy = (args = [], { ssh, status = 200, noImage = false } = {}) => {
  const env = { ...isolated(), PATH: `${ join(root, 'fake-bin') }:${ process.env.PATH }`, FAKE_HTTP_STATUS: String(status), DEPLOY_HEALTH_TRIES: '2', DEPLOY_HEALTH_INTERVAL: '0' }
  if (ssh !== undefined) env.SSH_ORIGINAL_COMMAND = ssh
  if (noImage) env.FAKE_NO_IMAGE = '1'
  const result = spawnSync(join(server(), 'bin', 'deploy'), args, { env, encoding: 'utf8' })
  return { out: result.stdout ?? '', err: result.stderr ?? '', code: result.status }
}
const lines = file => existsSync(file) ? readFileSync(file, 'utf8').trim().split('\n') : []
const dockerCalls = () => lines(dockerLog())
const curlCalls = () => lines(curlLog())
const serverHead = () => git(server(), 'rev-parse', 'HEAD')

const BUILD = ['image inspect myflix-nginx:latest', 'tag myflix-nginx:latest myflix-nginx:previous', 'compose up -d --build']

describe('a request it does not accept', () => {
  let head
  beforeEach(() => {
    release('v1', { 'frontend/client/app.js': "'v2'\n" })
    head = serverHead()
  })
  afterEach(() => {
    expect(serverHead()).toBe(head)
    expect(dockerCalls()).toEqual([])
  })

  it('refuses no request at all', () => {
    expect(deploy().code).toBe(2)
  })

  it('refuses a verb other than deploy', () => {
    expect(deploy(['rollback', 'v1']).code).toBe(2)
  })

  it('refuses something that is not a version tag', () => {
    const result = deploy(['deploy', 'v1; rm -rf ~'])
    expect(result.code).toBe(2)
    expect(result.err).toMatch(/not a version tag/)
  })

  it('refuses extra words after the tag over SSH', () => {
    expect(deploy([], { ssh: 'deploy v1 now' }).code).toBe(2)
  })

  it('takes the request from SSH over its arguments', () => {
    expect(deploy(['deploy', 'v1'], { ssh: 'shell' }).code).toBe(2)
  })
})

describe('a server or tag it should not move to', () => {
  it('refuses when a tracked file was changed on the server', () => {
    release('v1', { 'frontend/client/app.js': "'v2'\n" })
    writeFileSync(join(server(), 'frontend/client/app.js'), "'edited'\n")
    const result = deploy(['deploy', 'v1'])
    expect(result.code).toBe(1)
    expect(result.err).toMatch(/uncommitted changes/)
    expect(dockerCalls()).toEqual([])
  })

  it('refuses when the server is not on master', () => {
    release('v1', { 'frontend/client/app.js': "'v2'\n" })
    git(server(), 'checkout', '--quiet', '-b', 'other')
    expect(deploy(['deploy', 'v1']).code).toBe(1)
    expect(dockerCalls()).toEqual([])
  })

  it('refuses a tag that is not on master', () => {
    git(seed(), 'checkout', '--quiet', '-b', 'feature')
    commit({ 'frontend/client/app.js': "'feature'\n" })
    git(seed(), 'tag', 'v9')
    git(seed(), 'push', '--quiet', 'origin', 'v9')
    const head = serverHead()
    const result = deploy(['deploy', 'v9'])
    expect(result.code).toBe(1)
    expect(result.err).toMatch(/not on master/)
    expect(serverHead()).toBe(head)
    expect(dockerCalls()).toEqual([])
  })

  it('refuses a tag that does not exist', () => {
    expect(deploy(['deploy', 'v404']).code).toBe(1)
    expect(dockerCalls()).toEqual([])
  })

  it('refuses a tag behind the server', () => {
    release('v1', { 'frontend/client/app.js': "'v2'\n" })
    const v2 = release('v2', { 'frontend/client/app.js': "'v3'\n" })
    expect(deploy(['deploy', 'v2']).code).toBe(0)
    rmSync(dockerLog(), { force: true })
    const result = deploy(['deploy', 'v1'])
    expect(result.code).toBe(1)
    expect(result.err).toMatch(/behind/)
    expect(serverHead()).toBe(v2)
    expect(dockerCalls()).toEqual([])
  })

  it('refuses a tag that was moved after the server fetched it', () => {
    const v1 = release('v1', { 'frontend/client/app.js': "'v2'\n" })
    expect(deploy(['deploy', 'v1']).code).toBe(0)
    rmSync(dockerLog(), { force: true })
    commit({ 'frontend/client/app.js': "'moved'\n" })
    git(seed(), 'tag', '--force', 'v1')
    git(seed(), 'push', '--quiet', '--force', 'origin', 'master', 'v1')
    expect(deploy(['deploy', 'v1']).code).toBe(1)
    expect(serverHead()).toBe(v1)
    expect(dockerCalls()).toEqual([])
  })
})

describe('a deploy', () => {
  it('fast-forwards master to the tag, keeps the running image as previous, then rebuilds', () => {
    const v1 = release('v1', { 'frontend/client/app.js': "'v2'\n" })
    const result = deploy(['deploy', 'v1'])
    expect(result.code).toBe(0)
    expect(serverHead()).toBe(v1)
    expect(dockerCalls()).toEqual(BUILD)
    expect(result.out).toMatch(new RegExp(`Deploying v1: \\w{7} -> ${ v1.slice(0, 7) }`))
  })

  it('builds without keeping a previous image when none is running yet', () => {
    release('v1', { 'frontend/client/app.js': "'v2'\n" })
    expect(deploy(['deploy', 'v1'], { noImage: true }).code).toBe(0)
    expect(dockerCalls()).toEqual(['image inspect myflix-nginx:latest', 'compose up -d --build'])
  })

  it('redeploys the tag the server is already on without moving it', () => {
    const v1 = release('v1', { 'frontend/client/app.js': "'v2'\n" })
    deploy(['deploy', 'v1'])
    rmSync(dockerLog(), { force: true })
    const result = deploy(['deploy', 'v1'])
    expect(result.code).toBe(0)
    expect(serverHead()).toBe(v1)
    // The running image is this release's, so tagging it would replace the release before it as the rollback.
    expect(dockerCalls()).toEqual(['compose up -d --build'])
    expect(result.out).toMatch(/Redeploying v1/)
  })

  it('ignores untracked files', () => {
    release('v1', { 'frontend/client/app.js': "'v2'\n" })
    writeFileSync(join(server(), 'notes.txt'), 'local\n')
    expect(deploy(['deploy', 'v1']).code).toBe(0)
  })

  it('deploys the tag named over SSH', () => {
    const v1 = release('v1', { 'frontend/client/app.js': "'v2'\n" })
    expect(deploy([], { ssh: 'deploy v1' }).code).toBe(0)
    expect(serverHead()).toBe(v1)
  })

  it('succeeds when the site answers 200, checking myflix.stream by default', () => {
    release('v1', { 'frontend/client/app.js': "'v2'\n" })
    const result = deploy(['deploy', 'v1'])
    expect(result.code).toBe(0)
    expect(curlCalls()).toHaveLength(1)
    expect(curlCalls()[0]).toMatch(/https:\/\/myflix\.stream\//)
    expect(result.out).toMatch(/answered 200: deployed v1/)
  })

  it('fails when the site keeps answering something else', () => {
    release('v1', { 'frontend/client/app.js': "'v2'\n" })
    const result = deploy(['deploy', 'v1'], { status: 502 })
    expect(result.code).toBe(1)
    expect(curlCalls()).toHaveLength(2)
    expect(result.err).toMatch(/answered 502 after 2 tries/)
  })
})
