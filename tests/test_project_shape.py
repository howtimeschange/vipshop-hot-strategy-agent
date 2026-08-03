from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT / "scripts") not in sys.path:
    sys.path.insert(0, str(ROOT / "scripts"))
if str(ROOT / "src") not in sys.path:
    sys.path.insert(0, str(ROOT / "src"))

from quick_validate import validate
from vipshop_hot_strategy_agent.paths import paths, project_root


class ProjectShapeTest(unittest.TestCase):
    def test_required_files_exist(self) -> None:
        self.assertEqual(validate(ROOT), [])

    def test_paths_resolve_project_root(self) -> None:
        self.assertEqual(project_root(), ROOT)
        self.assertEqual(paths().assets, ROOT / "assets")
        self.assertTrue((paths().docs / "requirements-extracted.txt").is_file())


if __name__ == "__main__":
    unittest.main()
