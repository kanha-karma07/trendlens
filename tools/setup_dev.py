"""
TrendLens Developer Environment Verification Tool
"""
import sys
import shutil
import subprocess

def check_command(cmd: str, name: str) -> bool:
    path = shutil.which(cmd)
    if path:
        print(f" [OK] {name} is installed: {path}")
        return True
    else:
        print(f" [MISSING] {name} is NOT found in PATH.")
        return False

def main():
    print("=" * 60)
    print("TrendLens Environment Checker")
    print("=" * 60)
    
    python_ok = sys.version_info >= (3, 11)
    if python_ok:
        print(f" [OK] Python version: {sys.version.split()[0]} (>= 3.11)")
    else:
        print(f" [WARN] Python version: {sys.version.split()[0]} (Recommended >= 3.11)")

    node_ok = check_command("node", "Node.js")
    npm_ok = check_command("npm", "NPM")
    docker_ok = check_command("docker", "Docker")
    compose_ok = check_command("docker-compose", "Docker Compose") or docker_ok
    git_ok = check_command("git", "Git")

    print("\nSummary:")
    if all([python_ok, node_ok, npm_ok, git_ok]):
        print(" Development environment has required core toolchains ready!")
    else:
        print(" Some optional or required developer tools need attention.")
    print("=" * 60)

if __name__ == "__main__":
    main()
