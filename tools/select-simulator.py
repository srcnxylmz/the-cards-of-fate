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
device = devices[0]
print(json.dumps(device, indent=2))
with open(os.environ["GITHUB_ENV"], "a", encoding="utf-8") as env:
    env.write(f"SIMULATOR_UDID={device['udid']}\n")
if device["state"] != "Booted":
    subprocess.run(["xcrun", "simctl", "boot", device["udid"]], check=True)
subprocess.run(["xcrun", "simctl", "bootstatus", device["udid"], "-b"], check=True)
