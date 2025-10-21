# Branching & Merge Workflow

This project uses a simple two-branch workflow while development remains active:

- `work` holds the in-progress feature work (the branch you are currently on in this environment).
- `main` is the release-ready branch that should always reflect the latest stable snapshot.

## Creating `main`

If you have just cloned the repository and only see the `work` branch, create `main` locally from the current tip:

```bash
git checkout -b main
```

This will put you on `main` with the exact same code as `work`. From there you can continue regular merges.

## Merging updates from `work`

Whenever changes in `work` are ready, fast-forward merge them into `main`:

```bash
git checkout main
git merge work
```

Push both branches so that remote history stays in sync:

```bash
git push origin main
git push origin work
```

## Keeping branches up to date

If collaborators are pushing directly to `main`, make sure `work` stays updated to avoid conflicts:

```bash
git checkout work
git pull --rebase origin main
```

This rebases your local work branch on top of the latest `main` history, keeping the commit graph linear.

## Preparing a release

1. Ensure the Expo project builds locally (`npm run android:app`).
2. Lint the codebase (`npm run lint`).
3. Merge `work` into `main` as described above.
4. Tag the release as needed (for example, `git tag v1.0.0 && git push origin v1.0.0`).

Following these steps will keep `main` ready for submission to Google Play or other distribution channels.
