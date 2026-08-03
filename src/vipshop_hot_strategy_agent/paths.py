from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class ProjectPaths:
    root: Path
    assets: Path
    docs: Path
    outputs: Path


def project_root() -> Path:
    current = Path(__file__).resolve()
    for parent in current.parents:
        if (parent / "pyproject.toml").is_file() and (parent / "assets").is_dir():
            return parent
    return current.parents[2]


def paths() -> ProjectPaths:
    root = project_root()
    return ProjectPaths(
        root=root,
        assets=root / "assets",
        docs=root / "docs",
        outputs=root / "outputs",
    )
