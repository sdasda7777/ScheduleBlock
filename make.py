import json, os, sys, zipfile

def zip_dir(targetZip: zipfile.ZipFile,
            sourceDir: str,
            includeRootDir: bool = False,
            aliasedFiles: list[tuple] = [],
            excludeDirs: list[str] = []):

    aliasedFiles2 = {os.path.join(sourceDir, x[0]): os.path.join(sourceDir, x[1]) for x in aliasedFiles}
    excludeDirs2 = map(lambda x: os.path.join(sourceDir, x), excludeDirs)

    for root, dirs, files in os.walk(sourceDir, topdown=True):
        dirs[:] = [d for d in dirs if os.path.join(root, d) not in excludeDirs2]
        for file in files:
            pathToFile: str = os.path.join(root, file)
            nameInArchive: str = pathToFile if pathToFile not in aliasedFiles2 else aliasedFiles2[pathToFile]
            targetZip.write(pathToFile,
                            os.path.relpath(nameInArchive,
                                            os.path.join(sourceDir, '..') if includeRootDir else sourceDir))

if __name__ == "__main__":
    # Check versions are in sync
    manifest_chrome = json.loads(open("manifest.json", "r").read())
    manifest_firefox = json.loads(open("manifestff.json", "r").read())
    if manifest_chrome["version"] != manifest_firefox["version"]:
        if input(f"Manifest version for Chrome ({manifest_chrome['version']}) is different than the manifest version for Firefox ({manifest_firefox['version']}). Continue? (y/[n])").lower() != "y":
            sys.exit(1)

    os.makedirs("build", exist_ok=True)

    # Build zip for Chrome
    with zipfile.ZipFile(f"build/ScheduleBlock_{manifest_chrome['version']}.zip", "w", zipfile.ZIP_DEFLATED) as zipf:
        zip_dir(targetZip=zipf, sourceDir=".", includeRootDir=True,
                excludeDirs=[".git", "build"])

    # Build zip for Firefox
    with zipfile.ZipFile(f"build/ScheduleBlockFF_{manifest_firefox['version']}.zip", "w", zipfile.ZIP_DEFLATED) as zipf:
        zip_dir(targetZip=zipf, sourceDir=".", includeRootDir=False,
                excludeDirs=[".git", "build"],
                aliasedFiles=[("manifest.json", "manifestch.json"),
                              ("manifestff.json", "manifest.json")])
