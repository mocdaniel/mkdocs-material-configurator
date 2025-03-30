/**
 * Gets the version string based on available git information
 * Format: v<git-tag> if a git tag exists, <short git commit hash> if no tag but a commit hash exists, empty string otherwise
 */
export function getVersionString(): string {
  // In a real implementation, these would be set during build time
  // For example, using environment variables in Next.js:
  // const gitTag = process.env.NEXT_PUBLIC_GIT_TAG
  // const gitCommitHash = process.env.NEXT_PUBLIC_GIT_COMMIT_HASH

  // For demonstration purposes, we'll use placeholders
  const gitTag = process.env.NEXT_PUBLIC_GIT_TAG || ""
  const gitCommitHash = process.env.NEXT_PUBLIC_GIT_COMMIT_HASH || ""

  if (gitTag) {
    return `v${gitTag}`
  } else if (gitCommitHash) {
    // Usually we'd want the short hash (first 7 characters)
    return gitCommitHash.substring(0, 7)
  }

  return ""
}

