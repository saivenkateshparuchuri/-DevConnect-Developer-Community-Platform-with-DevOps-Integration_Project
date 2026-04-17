import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
  createCodingProblem,
  deleteCodingProblem,
  getCodingProblemById,
  getCodingProblems,
  getMyCodingStats,
  getMyCodingSubmissions,
  submitCodingSolution,
  updateCodingProblem
} from "../services/api";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" }
];

const defaultAdminForm = {
  id: null,
  title: "",
  slug: "",
  description: "",
  difficulty: "Easy",
  points: 10,
  tags: "arrays",
  constraints: "",
  functionName: "solve",
  examplesText: "nums=[2,7,11,15], target=9 -> [0,1]",
  testsJson: '[{"args":[[2,7,11,15],9],"expected":[0,1]}]',
  starterJavascript: "function solve(nums, target) {\n  return [];\n}",
  starterPython: "def solve(nums, target):\n    return []\n",
  starterJava:
    "class Solution {\n    public static int[] solve(int[] nums, int target) {\n        return new int[]{};\n    }\n}\n",
  starterCpp:
    "#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int target) {\n    return {};\n}\n"
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const parseExamplesText = (value) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("->");
      return {
        input: (parts[0] || "").trim(),
        output: (parts[1] || "").trim(),
        explanation: ""
      };
    })
    .filter((example) => example.input && example.output);

const DIFFICULTY_ORDER = {
  Easy: 0,
  Medium: 1,
  Hard: 2
};

const sortProblemsByDifficulty = (problems) =>
  [...problems].sort((left, right) => {
    const difficultyDelta = (DIFFICULTY_ORDER[left.difficulty] ?? 99) - (DIFFICULTY_ORDER[right.difficulty] ?? 99);
    if (difficultyDelta !== 0) return difficultyDelta;

    const pointsDelta = (left.points || 0) - (right.points || 0);
    if (pointsDelta !== 0) return pointsDelta;

    return (left.title || "").localeCompare(right.title || "");
  });

function CodingPractice() {
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = Boolean(localStorage.getItem("adminToken"));
  const [adminForm, setAdminForm] = useState(defaultAdminForm);
  const [adminLoading, setAdminLoading] = useState(false);

  const orderedProblems = useMemo(() => sortProblemsByDifficulty(problems), [problems]);
  const visibleProblems = useMemo(
    () => (isAdmin ? orderedProblems : orderedProblems.slice(0, 10)),
    [isAdmin, orderedProblems]
  );

  const selectedStarterCode = useMemo(() => {
    if (!selectedProblem?.starterCode) return "";
    return selectedProblem.starterCode[language] || "";
  }, [selectedProblem, language]);

  const loadProblemDetails = async (problemId, preserveCode = false) => {
    const details = await getCodingProblemById(problemId);
    setSelectedProblem(details);
    if (!preserveCode) {
      setCode(details.starterCode?.[language] || "");
    }
  };

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [problemList, mySubmissions, myStats] = await Promise.all([
        getCodingProblems(),
        getMyCodingSubmissions(),
        getMyCodingStats()
      ]);

      const sortedProblems = sortProblemsByDifficulty(problemList);
      setProblems(sortedProblems);
      setSubmissions(mySubmissions);
      setStats(myStats);

      const availableProblems = isAdmin ? sortedProblems : sortedProblems.slice(0, 10);

      if (availableProblems.length > 0) {
        const nextId = selectedProblemId && availableProblems.some((problem) => problem._id === selectedProblemId)
          ? selectedProblemId
          : availableProblems[0]._id;

        setSelectedProblemId(nextId);
        await loadProblemDetails(nextId);
      }
    } catch (err) {
      setError(err.message || "Failed to load coding practice data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedProblem) return;
    setCode(selectedProblem.starterCode?.[language] || "");
    setResult(null);
  }, [language, selectedProblem]);

  const handleChangeProblem = async (problemId) => {
    setSelectedProblemId(problemId);
    setResult(null);
    try {
      await loadProblemDetails(problemId);
    } catch (err) {
      setError(err.message || "Failed to load selected problem");
    }
  };

  const onSubmit = async () => {
    if (!selectedProblem?._id) return;
    setSubmitLoading(true);
    setError("");

    try {
      const response = await submitCodingSolution(selectedProblem._id, {
        language,
        code
      });

      setResult(response.submission);
      await loadAll();
    } catch (err) {
      setError(err.message || "Failed to submit code");
    } finally {
      setSubmitLoading(false);
    }
  };

  const onReset = () => {
    setCode(selectedStarterCode);
    setResult(null);
  };

  const loadSelectedIntoAdminForm = () => {
    if (!selectedProblem) return;
    setAdminForm({
      id: selectedProblem._id,
      title: selectedProblem.title || "",
      slug: selectedProblem.slug || "",
      description: selectedProblem.description || "",
      difficulty: selectedProblem.difficulty || "Easy",
      points: selectedProblem.points || 10,
      tags: (selectedProblem.tags || []).join(", "),
      constraints: (selectedProblem.constraints || []).join("\n"),
      functionName: selectedProblem.functionName || "solve",
      examplesText: (selectedProblem.examples || [])
        .map((example) => `${example.input} -> ${example.output}`)
        .join("\n"),
      testsJson: JSON.stringify(selectedProblem.tests || [], null, 2),
      starterJavascript: selectedProblem.starterCode?.javascript || "",
      starterPython: selectedProblem.starterCode?.python || "",
      starterJava: selectedProblem.starterCode?.java || "",
      starterCpp: selectedProblem.starterCode?.cpp || ""
    });
  };

  const resetAdminForm = () => {
    setAdminForm(defaultAdminForm);
  };

  const onAdminSave = async () => {
    setAdminLoading(true);
    setError("");

    try {
      const payload = {
        title: adminForm.title,
        slug: adminForm.slug,
        description: adminForm.description,
        difficulty: adminForm.difficulty,
        points: Number(adminForm.points),
        tags: adminForm.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        constraints: adminForm.constraints
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        functionName: adminForm.functionName,
        examples: parseExamplesText(adminForm.examplesText),
        tests: JSON.parse(adminForm.testsJson),
        starterCode: {
          javascript: adminForm.starterJavascript,
          python: adminForm.starterPython,
          java: adminForm.starterJava,
          cpp: adminForm.starterCpp
        }
      };

      if (adminForm.id) {
        await updateCodingProblem(adminForm.id, payload);
      } else {
        await createCodingProblem(payload);
      }

      resetAdminForm();
      await loadAll();
    } catch (err) {
      setError(err.message || "Failed to save coding problem");
    } finally {
      setAdminLoading(false);
    }
  };

  const onAdminDelete = async () => {
    const targetId = selectedProblem?._id || adminForm.id;
    if (!targetId) {
      setError("Select a problem first to delete");
      return;
    }

    if (!window.confirm("Delete this practice problem permanently?")) return;

    setAdminLoading(true);
    setError("");
    try {
      await deleteCodingProblem(targetId);
      resetAdminForm();
      setSelectedProblem(null);
      setSelectedProblemId(null);
      await loadAll();
    } catch (err) {
      setError(err.message || "Failed to delete coding problem");
    } finally {
      setAdminLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-5 text-center text-light">Loading coding practice...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-4 d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h3 className="fw-bold text-light mb-1">Coding Practice</h3>
          <p className="text-white-50 mb-0">
            Backend-powered coding sets with multi-language submissions, history, and score tracking.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2">{error}</div>
      )}

      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-md-3"><div className="card border-0 p-3" style={{ background: "rgba(15, 23, 42, 0.72)", color: "#e2e8f0" }}><div className="small text-white-50">Coding Score</div><div className="h4 mb-0">{stats.codingScore}</div></div></div>
          <div className="col-md-3"><div className="card border-0 p-3" style={{ background: "rgba(15, 23, 42, 0.72)", color: "#e2e8f0" }}><div className="small text-white-50">Solved Problems</div><div className="h4 mb-0">{stats.solvedProblems}</div></div></div>
          <div className="col-md-3"><div className="card border-0 p-3" style={{ background: "rgba(15, 23, 42, 0.72)", color: "#e2e8f0" }}><div className="small text-white-50">Accepted Submissions</div><div className="h4 mb-0">{stats.acceptedSubmissions}</div></div></div>
          <div className="col-md-3"><div className="card border-0 p-3" style={{ background: "rgba(15, 23, 42, 0.72)", color: "#e2e8f0" }}><div className="small text-white-50">Total Submissions</div><div className="h4 mb-0">{stats.totalSubmissions}</div></div></div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-xl-3">
          <div className="p-3 rounded-4" style={{ background: "rgba(15, 23, 42, 0.72)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
            <h5 className="text-light fw-semibold mb-3">Problem Sets</h5>
            <div className="d-flex flex-column gap-2">
              {visibleProblems.map((problem) => {
                const active = selectedProblemId === problem._id;
                return (
                  <button
                    key={problem._id}
                    type="button"
                    className="btn text-start"
                    onClick={() => handleChangeProblem(problem._id)}
                    style={{
                      borderRadius: "0.85rem",
                      border: active ? "1px solid rgba(56, 189, 248, 0.7)" : "1px solid rgba(148, 163, 184, 0.25)",
                      background: active ? "linear-gradient(135deg, rgba(14,116,144,0.42), rgba(30,64,175,0.35))" : "rgba(15, 23, 42, 0.55)",
                      color: "#e2e8f0"
                    }}
                  >
                    <div className="fw-semibold">{problem.title}</div>
                    <small className="text-white-50">{problem.difficulty} • {problem.points} pts</small>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="p-3 rounded-4" style={{ background: "rgba(15, 23, 42, 0.72)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
            {!selectedProblem ? (
              <div className="text-white-50">No coding problems available yet. Admin can add one below.</div>
            ) : (
              <>
                <h4 className="text-light fw-bold mb-2">{selectedProblem.title}</h4>
                <p className="text-white-50">{selectedProblem.description}</p>

                <div className="mb-3">
                  <div className="small text-info fw-semibold text-uppercase mb-1">Examples</div>
                  {(selectedProblem.examples || []).map((example, index) => (
                    <div key={`${example.input}-${index}`} className="text-white-50" style={{ fontSize: "0.9rem" }}>
                      - {example.input}{" -> "}{example.output}
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <div className="small text-info fw-semibold text-uppercase mb-1">Constraints</div>
                  {(selectedProblem.constraints || []).map((constraint, index) => (
                    <div key={`${constraint}-${index}`} className="text-white-50" style={{ fontSize: "0.9rem" }}>
                      - {constraint}
                    </div>
                  ))}
                </div>

                <div className="mb-2">
                  <label className="form-label text-light fw-semibold mb-2">Language</label>
                  <select
                    className="form-select"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    style={{ background: "rgba(15, 23, 42, 0.8)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.35)" }}
                  >
                    {LANGUAGES.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>

                <label className="form-label text-light fw-semibold mb-2">Editor</label>
                <textarea
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  className="form-control mb-3"
                  spellCheck={false}
                  style={{
                    minHeight: "260px",
                    resize: "vertical",
                    borderRadius: "0.9rem",
                    background: "#0b1220",
                    color: "#dbeafe",
                    border: "1px solid rgba(148, 163, 184, 0.25)",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    fontSize: "0.92rem"
                  }}
                />

                {language !== "javascript" && (
                  <div className="alert alert-warning py-2 mb-3">
                    Automatic judging currently runs for JavaScript. Python/Java/C++ submissions are stored and marked Pending for review.
                  </div>
                )}

                <div className="d-flex gap-2 flex-wrap mb-3">
                  <button
                    type="button"
                    className="btn fw-semibold"
                    onClick={onSubmit}
                    disabled={submitLoading || !code.trim()}
                    style={{ borderRadius: "0.8rem", background: "linear-gradient(135deg, #0ea5e9, #2563eb)", color: "white", border: "none" }}
                  >
                    {submitLoading ? "Submitting..." : "Run & Submit"}
                  </button>
                  <button type="button" className="btn btn-outline-light fw-semibold" onClick={onReset} style={{ borderRadius: "0.8rem" }}>
                    Reset Code
                  </button>
                </div>

                {result && (
                  <div className="rounded-4 p-3" style={{ border: "1px solid rgba(148, 163, 184, 0.3)", background: "rgba(15, 23, 42, 0.5)" }}>
                    <div className="fw-semibold text-light mb-1">Status: {result.status}</div>
                    <div className="text-white-50 mb-2">{result.resultSummary}</div>
                    <div className="text-white-50 small">
                      Passed {result.passedTests}/{result.totalTests} tests • Score awarded: {result.scoreAwarded}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="col-xl-3">
          <div className="p-3 rounded-4 mb-3" style={{ background: "rgba(15, 23, 42, 0.72)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
            <h6 className="text-light fw-semibold mb-2">My Recent Submissions</h6>
            <div className="d-flex flex-column gap-2" style={{ maxHeight: "340px", overflowY: "auto" }}>
              {submissions.slice(0, 8).map((item) => (
                <div key={item._id} className="p-2 rounded-3" style={{ background: "rgba(15, 23, 42, 0.55)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
                  <div className="text-light small fw-semibold">{item.problem?.title || "Problem"}</div>
                  <div className="text-white-50" style={{ fontSize: "0.8rem" }}>
                    {item.language.toUpperCase()} • {item.status} • {formatDate(item.createdAt)}
                  </div>
                  <div className="text-white-50" style={{ fontSize: "0.78rem" }}>
                    Score: {item.scoreAwarded} • {item.passedTests}/{item.totalTests} tests
                  </div>
                </div>
              ))}
              {submissions.length === 0 && <div className="text-white-50 small">No submissions yet.</div>}
            </div>
          </div>

          {isAdmin && (
            <div className="p-3 rounded-4" style={{ background: "rgba(15, 23, 42, 0.72)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
              <h6 className="text-light fw-semibold mb-2">Admin: Add/Edit Problem</h6>
              <div className="d-grid gap-2">
                <input className="form-control" placeholder="Title" value={adminForm.title} onChange={(event) => setAdminForm((prev) => ({ ...prev, title: event.target.value }))} />
                <input className="form-control" placeholder="Slug (optional)" value={adminForm.slug} onChange={(event) => setAdminForm((prev) => ({ ...prev, slug: event.target.value }))} />
                <textarea className="form-control" placeholder="Description" value={adminForm.description} onChange={(event) => setAdminForm((prev) => ({ ...prev, description: event.target.value }))} />
                <div className="d-flex gap-2">
                  <select className="form-select" value={adminForm.difficulty} onChange={(event) => setAdminForm((prev) => ({ ...prev, difficulty: event.target.value }))}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <input className="form-control" type="number" min="0" placeholder="Points" value={adminForm.points} onChange={(event) => setAdminForm((prev) => ({ ...prev, points: event.target.value }))} />
                </div>
                <input className="form-control" placeholder="Tags (comma separated)" value={adminForm.tags} onChange={(event) => setAdminForm((prev) => ({ ...prev, tags: event.target.value }))} />
                <textarea className="form-control" placeholder="Constraints (one per line)" value={adminForm.constraints} onChange={(event) => setAdminForm((prev) => ({ ...prev, constraints: event.target.value }))} />
                <input className="form-control" placeholder="Function name" value={adminForm.functionName} onChange={(event) => setAdminForm((prev) => ({ ...prev, functionName: event.target.value }))} />
                <textarea className="form-control" placeholder="Examples: input -> output (one per line)" value={adminForm.examplesText} onChange={(event) => setAdminForm((prev) => ({ ...prev, examplesText: event.target.value }))} />
                <textarea className="form-control" placeholder='Tests JSON: [{"args":...,"expected":...}]' value={adminForm.testsJson} onChange={(event) => setAdminForm((prev) => ({ ...prev, testsJson: event.target.value }))} style={{ minHeight: "110px", fontFamily: "ui-monospace, Menlo, Monaco, Consolas, monospace", fontSize: "0.82rem" }} />
                <textarea className="form-control" placeholder="Starter JavaScript" value={adminForm.starterJavascript} onChange={(event) => setAdminForm((prev) => ({ ...prev, starterJavascript: event.target.value }))} style={{ minHeight: "90px" }} />
                <textarea className="form-control" placeholder="Starter Python" value={adminForm.starterPython} onChange={(event) => setAdminForm((prev) => ({ ...prev, starterPython: event.target.value }))} style={{ minHeight: "90px" }} />
                <textarea className="form-control" placeholder="Starter Java" value={adminForm.starterJava} onChange={(event) => setAdminForm((prev) => ({ ...prev, starterJava: event.target.value }))} style={{ minHeight: "90px" }} />
                <textarea className="form-control" placeholder="Starter C++" value={adminForm.starterCpp} onChange={(event) => setAdminForm((prev) => ({ ...prev, starterCpp: event.target.value }))} style={{ minHeight: "90px" }} />
                <div className="d-flex gap-2 flex-wrap">
                  <button type="button" className="btn btn-outline-info btn-sm" onClick={loadSelectedIntoAdminForm}>Load Selected</button>
                  <button type="button" className="btn btn-outline-light btn-sm" onClick={resetAdminForm}>Reset</button>
                </div>
                <button type="button" className="btn btn-success btn-sm" onClick={onAdminSave} disabled={adminLoading}>
                  {adminLoading ? "Saving..." : adminForm.id ? "Update Problem" : "Create Problem"}
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={onAdminDelete}
                  disabled={adminLoading || (!selectedProblem?._id && !adminForm.id)}
                >
                  Delete Selected Problem
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default CodingPractice;
