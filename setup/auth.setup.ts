import { test as baseTest, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { ApiClient } from '../api/ApiClient';

const authFile = path.resolve(__dirname, 'token.json');

export * from '@playwright/test';
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [async ({}, use) => {
    // Use parallelIndex as a unique identifier for each worker.
    const id = baseTest.info().parallelIndex;
    const fileName = path.resolve(baseTest.info().project.outputDir, `.auth/${id}.json`);

    if (fs.existsSync(fileName)) {
      // Reuse existing authentication state if any.
      await use(fileName);
      return;
    }

    // Important: make sure we authenticate in a clean environment by unsetting storage state.
    const context = await request.newContext({ storageState: undefined });

    // Authenticate and get the token
    let client = ApiClient.unauthorized();
    const { headers } = await client.challenger.post();
    const token = headers["x-challenger"];
    client.options = { token };
    client.challenges.options = { token };
    console.log(client.challenges.options);

    // Write the token to token.json
    const tokenData = { token: client.challenges.options.token };
    fs.writeFileSync(authFile, JSON.stringify(tokenData, null, 2));

    // Save the storage state
    await context.storageState({ path: fileName });
    await context.dispose();
    await use(fileName);
  }, { scope: 'worker' }],
});