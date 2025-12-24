# UiPlay :3

A Tauri and Qwik based UxPlay wrapper that forwards music metadata to Discord Rich Presence and MPRIS.

## Building
To build the project, ensure you have the necessary dependencies installed:
- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/tools/install)
- [pnpm](https://pnpm.io/installation)
- [UxPlay](https://github.com/FDH2/uxplay)

Then, run the following commands in the project root:

```bash
pnpm install
pnpm tauri build
```