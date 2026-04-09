from pathlib import Path


def test_skill_path_is_in_user_home():
    from flts.agent.tools.knowledge import SKILL_PATH, JOURNAL_PATH, FLTS_DIR
    assert FLTS_DIR == Path.home() / ".flts"
    assert SKILL_PATH == FLTS_DIR / "skill.md"
    assert JOURNAL_PATH == FLTS_DIR / "journal.jsonl"


def test_skill_path_not_in_package():
    from flts.agent.tools.knowledge import SKILL_PATH
    package_dir = Path(__file__).parent.parent / "src" / "flts" / "data"
    assert not str(SKILL_PATH).startswith(str(package_dir))
