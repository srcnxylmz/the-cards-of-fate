"""Pick a real available iPhone from simctl's inventory; never assume a runner model."""
import json
import subprocess
import os

inventory = json.loads(subprocess.check_output(["xcrun", "simctl", "list", "devices", "available", "--json"]))
devices = [d for runtime, rows in inventory["devices"].items() if ".iOS-" in runtime
           for d in rows if d.get("isAvailable") and d["name"].startswith("iPhone")]
if not devices:
    raise SystemExit("No available iPhone simulator/runtime installed")
devices.sort(key=lambda d: (d["name"] != "iPhone 16", d["name"]))

# Exercise the compact portrait layout in this single CI job when the installed runtime supports it.
compact = [d for d in devices if "SE" in d["name"]]
if not compact:
    types = json.loads(subprocess.check_output(["xcrun", "simctl", "list", "devicetypes", "--json"]))["devicetypes"]
    se = next((t for t in types if t["name"] == "iPhone SE (3rd generation)"), None)
    runtimes = json.loads(subprocess.check_output(["xcrun", "simctl", "list", "runtimes", "--json"]))["runtimes"]
    ios = [r for r in runtimes if r.get("isAvailable") and ".iOS-" in r["identifier"]]
    ios.sort(key=lambda r: tuple(int(n) for n in r["version"].split(".")), reverse=True)
    if se and ios:
        created = subprocess.run(["xcrun", "simctl", "create", "Fate Compact QA", se["identifier"], ios[0]["identifier"]], capture_output=True, text=True)
        if created.returncode == 0:
            compact = [{"udid": created.stdout.strip(), "name": se["name"], "state": "Shutdown", "deviceTypeIdentifier": se["identifier"], "runtimeIdentifier": ios[0]["identifier"]}]
        else:
            print("Compact device unavailable; falling back to installed iPhone: " + created.stderr)
if compact:
    devices = compact
device = devices[0]
print(json.dumps(device, indent=2))
with open(os.environ["GITHUB_ENV"], "a", encoding="utf-8") as env:
    env.write(f"SIMULATOR_UDID={device['udid']}\n")
if device["state"] != "Booted":
    subprocess.run(["xcrun", "simctl", "boot", device["udid"]], check=True)
subprocess.run(["xcrun", "simctl", "bootstatus", device["udid"], "-b"], check=True)
