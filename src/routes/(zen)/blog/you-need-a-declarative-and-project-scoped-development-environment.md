---
title: You Need a Declarative and Project-Scoped Development Environment
date: 2025-5-5
---

Two of the most important qualities of a good development environment are **being declarative** and **project-scoped**.

## What Does "Declarative" Mean?

Many developers who haven’t fully adopted a declarative setup might think it means listing required command-line tools in a file that a provisioning tool installs for you.

But that’s only part of the story. Consider the following questions:

- Is installing a new tool a separate step from updating your provisioning configuration? If so, you might forget to do the latter, and the configuration becomes outdated.
- Some tools require configuration. Is that also captured by your provisioning configuration? If not, it’s another step you might forget and skip.
- Is removing a tool a separate step from removing it from the provisioning config? What about the unused dependencies?
- When two people provision the same configuration, do they get tools of exactly the same versions? In other words, is it reproducible?
- Does the provisioning tool ultimately work in an imperative way to apply the updates, and is thus very slow?

Being truly declarative means having a **single source of truth** for all the tools you need — including their exact versions and configurations — and relying on the provisioning tool to install, configure, and remove them. Regardless of your current system state, it should bring everything into alignment with your specification in **as few steps as possible**.

## Why Be Declarative?

First and foremost, it makes the development environment **reproducible**. Another developer can use your configuration to provision their system and end up with the exact same tools, eliminating an entire class of "works on my machine" bugs.

It also makes setting up a new machine incredibly fast. Whether you're reinstalling your OS or switching laptops, running just a few commands gets you back to a fully functional dev environment. It's like having a backup — not of your data, but of your entire working context.

But the real magic happens when this declarative setup is also **project-scoped**.

## What Does "Project-Scoped" Mean?

A project-scoped development environment is one of those things that, once you have tried it, you can't live without. The concept is simple: whenever you're "in" a project — meaning you've entered the folder in a terminal or opened it in an editor — **only the tools that project needs become available**. When you switch projects, your environment automatically updates to reflect the new set of dependencies.

For example:

1. Enter `~/website`. Running `node --version` returns `v22.15.1`; `python3` fails with "command not found".
1. Enter `~/llm`. `node --version` now returns `v24.1.0`; `python3 --version` returns `Python 3.9.6`
1. Exit to your home directory, and those tools become available (optional, but beneficial. We will cover it later).

There's no need to read documentation or install anything manually. Each project **declaratively declares its dependencies**, and the environment adapts automatically.

So how do you make this happen?

## Nix as a Solution

[Nix](https://nixos.org) is built exactly for this. It's designed from the ground up to be declarative.

Nix installs each package into a unique path like:

```
/nix/store/rs83v3ivkadsk9p1wk9qrzr3af26x829-coreutils-9.6
```

where `rs83v...` is a unique identifier capturing all inputs of this package: the package's own source code, dependencies and build instructions. When it builds a package, the build environment will, as the official docs say: "only find resources that have been declared explicitly as dependencies. There’s no way it can build until **everything it needs has been correctly declared**. If it builds, you will know you’ve provided a complete dependency list."

This design is a lot like Git commits, and it has powerful implications:

- This essentially makes a package **immutable**. If you need to change a package, just build a new one. Nix actually actively enforces this: `/nix/store` is always read only.
- This makes it really hard for any of one user's packages to be corrupted by another user.
- Atomic package upgrade and rollback come for free. Upgrading a package is just building a new one, rolling it back is just using the old one. There is no time window in which the package has some files from the old version and some files from the new version.
- Making two versions of the same tool **co-exist** comes for free. Installing a second version is exactly the same as installing a new package, since their paths don't collide.
- Since a package captures all its dependencies, the package, along with all its dependencies, can be copied between machines (of the same OS), and immediately usable.

You can use Nix as a standalone package manager, but the canonical way is to use it through NixOS. NixOS makes the whole operating system declaratively configurable, and in turns makes it possible to install packages declaratively. Refer to [the official manual](https://nixos.org/manual/nixos/stable/) on how to install NixOS. For macOS, check out [nix-darwin](https://github.com/nix-darwin/nix-darwin). For Windows, checkout [NixOS-WSL](https://github.com/nix-community/NixOS-WSL).

Once Nix id set up, your system configuration lives in `configuration.nix`. Let's examine how to install tools with Nix declaratively.

### Global Tools

Some tools, like Git, are useful across all projects. With Nix, making them globally available is as easy as using the following configuration:

```nix
{
  environment.systemPackages = with pkgs; [
    git
  ];
}
```

The configuration is written in the Nix language. Its syntax is really simple. You can probably [learn it](https://nix.dev/manual/nix/stable/language/) in under 20 minutes, though mastering the language takes longer.

### Project-Specific Tools

In order for the the development environment to update automatically for projects, you'll need [nix-direnv](https://github.com/nix-community/nix-direnv). Thanks to Nix, setting it up only requires a couple lines of configuration:

```diff
{
  environment.systemPackages = with pkgs; [
    git
  ];
+ programs.direnv = {
+    enable = true;
+    nix-direnv.enable = true;
+ };
}
```

Refer to nix-direnv's manual on how to write the configuration file for a project. TLDR: it's either a `flake.nix` or `shell.nix` file inside the project folder, and the configuration is typically something like (with boilerplate code omitted):

```nix
{
  devShell = with pkgs; mkShell {
    packages = [
      nodejs_24
      python313
    ];
  };
}
```

### Advantages of Nix

There are many benefits with this Nix setup, especially when keeping global tools minimal:

- Since adding dependencies is often just adding a name to a list, you're encouraged to declare all project dependencies explicitly, even for basic tools like `tar` and `curl`.
- If you forget to add a dependency, the "command not found" error is a helpful signal.
- Nix automatically generates a lock file. ensuring **identical versions** of tools are installed every time.
- Nix's package repository is massive, over 120,000 packages. Almost anything you need is available, and it's very easy to package things yourself in an ad hoc way, without having to submit it to the repository first.

### Disadvantages of Nix

A lot of Nix users have a love-hate relationship with Nix. Nix is known to have a **steep learning curve**. Many Nix users tend to copy and paste Nix configurations from the internet and feel stuck once anything stops working. It's not entirely their fault.

Nix's documentation's currently quite fragmented. There exist [multiple](https://nix.dev/manual/nix/latest/) [official](https://nixos.org/manual/nixos/stable/) [documentation](https://nixos.org/manual/nixpkgs/stable/) [sites](https://nix.dev), all overlapping with each other. Yet ironically, how to package software is actually not well covered. A lot of times, you need to dive into the source code of an existing package to understand how its done, and it's not always applicable.

The Nix language is also not a simple language. It's functional and lazily evaluated. A lot of people who are not familiar with functional programming might struggle to get used it. And the situation is exacerbated by Nix's standard library, which is integrated within the official package repository [nixpkgs](https://github.com/NixOS/nixpkgs). The library is quite complex but not thoroughly documented.

Finally, Nix is currently in the middle of transitioning to [flakes](https://nixos.wiki/wiki/Flakes), a new way of using Nix. This feature has been marked experimental for many years, but a lot users have switched to it. This creates a lot of confusions for new comers, especially when reading tutorials or community posts that mix old and new styles.

With that said, these drawbacks are most non-technical and can improve over time. The benefits still outweighs.

## Other Solutions

There are many other tools exist that can do provisioning, but hardly any of them tick all boxes. [Docker](https://www.docker.com) is a string contender. It however has a few drawbacks with regard to setting up a development environment:

- Docker by default is not reproducible. It will happily download software from any url you specified without verify its content when building a container. You need to do checksum manually if you want to ensure reproducibility.
- A Docker container is isolated from the host environment, especially on a non-Linux system. This creates frictions for a development environment. You sometimes have to jump through hoops in order to access files and ports in a container.
- You usually want to edit your project files on the host system and process them in the container. This requires you to share the project folder on the host with the container. On a non-Linux system, docker containers live in a virtual machine, sharing files this way makes them really slow to write to.

## Conclusion

In this article, I’ve outlined what I believe makes for an ideal development environment: one that is declarative, project-scoped, and ultimately reproducible. Nix enables all of these qualities with a unique approach that eliminates configuration drift, streamlines onboarding, and simplifies environment management across machines.

While Nix has its rough edges — especially around documentation and learning curve — its power and flexibility are unmatched once you get comfortable with its model. For developers who value automation, precision, and reproducibility, investing in Nix is well worth the effort.
