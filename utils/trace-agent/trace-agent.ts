import axios from 'axios';

async function classifyError(errorLog: string) {
  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "llama3",
    prompt: `You are a QA triage agent.
    Classify this Playwright error:\n${errorLog}\n
    Categories: Product Bug, Automation Bug, Environment Flake.
    Suggest Jira summary and description.`
  });
  return response.data.response;
}

(async () => {
  const result = await classifyError("Error: function timed out in Playwright Gmail compose test");
  console.log("LLM Output:", result);
})();
