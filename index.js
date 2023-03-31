// const core = require('@actions/core');
const { scrapeArchivedChangesets, scrapeBetaChangesets } = require('unity-changeset');
const { UnityChangeset } = require('unity-changeset/unityChangeset');

// most @actions toolkit packages have async methods
async function run() {
  try {

    console.log(UnityChangeset) 






    const minimumVersion = core.getInput('minimum-version');
    const maximumVersion = core.getInput('maximum-version');
    const patch = core.getInput('patch');
    const betaIncluded = core.getInput('beta-included');
    const appendVersions = core.getInput('append-versions');


    let results = betaIncluded
      ? (await (0, scrapeArchivedChangesets)()).concat(await (0, scrapeBetaChangesets)())
      : await (0, scrapeArchivedChangesets)();

    // Filter by min/max.
    const min = minimumVersion
        ? UnityChangeset.toNumber(minimumVersion, false)
        : Number.MIN_VALUE;
    const max = maximumVersion
        ? UnityChangeset.toNumber(maximumVersion, true)
        : Number.MAX_VALUE;
    results = results
        .filter((r) => options.grep ? r.version.includes(options.grep) : true)
        .filter((r) => min <= r.versionNumber && r.versionNumber <= max);
    // Group by minor version
    if (options.minorVersions) {
        results.forEach((r) => r.version = r.minor);
        results = Object.values(groupBy(results, (r) => r.version)).map((g) => g[0]);
    } // Group by minor version and get latest lifecycle patch
    else if (options.latestLifecycle) {
        results = Object.values(groupBy(results, (r) => r.minor))
            .map((g) => g.filter((v) => v.lifecycle == g[0].lifecycle)[0]);
    } // Group by minor version and get latest patch
    else if (options.latestPatch) {
        results = Object.values(groupBy(results, (r) => r.minor)).map((g) => g[0]);
    } // Group by minor version and get oldest patch
    else if (options.oldestPatch) {
        results = Object.values(groupBy(results, (r) => r.minor)).map((g) => g[g.length - 1]);
    }
    // If the result is empty, do not output anything
    if (results.length == 0) {
        return;
    }
    const res = options.versions || options.minorVersions
        ? results.map((r) => r.version)
        : results;
    // Output in json format or plain
    if (options.prettyJson) {
        console.log(JSON.stringify(res, null, "  "));
    }
    else if (options.json) {
        console.log(JSON.stringify(res));
    }
    else {
        console.log(res.map((r) => r.toString()).join("\n"));
    }











    if (!unityVersion)
      throw Error(`input 'unityVersion' is empty.`);

    const changeset = await getUnityChangeset(unityVersion);
    if (!changeset)
      throw Error(`the version '${unityVersion}' is not found.`);

    console.log(changeset.changeset);
    core.setOutput('changeset', changeset.changeset);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
