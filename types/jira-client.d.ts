declare module 'jira-client' {
  type JiraOptions = {
    protocol?: string;
    host: string;
    username?: string;
    password?: string;
    apiVersion?: string | number;
    strictSSL?: boolean;
  };

  class JiraClient {
    constructor(options: JiraOptions);
    addNewIssue(issue: any): Promise<any>;
    // minimal declarations used by project — add more as needed
  }

  export default JiraClient;
}
