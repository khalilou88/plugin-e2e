import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
  updateFile,
} from '@nrwl/nx-plugin/testing';
describe('my-plugin e2e', () => {
  it('should create my-plugin', async () => {
    const plugin = uniq('my-plugin');
    ensureNxProject('@plugin-e2e/my-plugin', 'dist/packages/my-plugin');

    let nxJson = readJson('nx.json');
    nxJson.plugins = ['@plugin-e2e/my-plugin'];
    updateFile('nx.json', JSON.stringify(nxJson));
    
    await runNxCommandAsync(
      `generate @plugin-e2e/my-plugin:my-plugin ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('my-plugin');
      ensureNxProject('@plugin-e2e/my-plugin', 'dist/packages/my-plugin');

      let nxJson = readJson('nx.json');
      nxJson.plugins = ['@plugin-e2e/my-plugin'];
      updateFile('nx.json', JSON.stringify(nxJson));


      await runNxCommandAsync(
        `generate @plugin-e2e/my-plugin:my-plugin ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const plugin = uniq('my-plugin');
      ensureNxProject('@plugin-e2e/my-plugin', 'dist/packages/my-plugin');

      let nxJson = readJson('nx.json');
      nxJson.plugins = ['@plugin-e2e/my-plugin'];
      updateFile('nx.json', JSON.stringify(nxJson));


      await runNxCommandAsync(
        `generate @plugin-e2e/my-plugin:my-plugin ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`libs/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
