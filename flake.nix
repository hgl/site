{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    { self, nixpkgs, ... }:
    let
      inherit (nixpkgs) lib;
      forAllSystems = lib.genAttrs lib.systems.flakeExposed;
    in
    {
      devShells = forAllSystems (system: {
        default =
          let
            pkgs = nixpkgs.legacyPackages.${system}.extend (
              final: prev: {
                nodejs = prev.callPackage ./nix/nodejs.nix {
                  nixpkgsPath = nixpkgs.outPath;
                };
              }
            );
            packages = with pkgs; [
              nil
              nixfmt-rfc-style
              nodejs
              nodePackages.svgo
              pnpm
              mozjpeg
              imagemagick
            ];
          in
          derivation {
            name = "shell";
            inherit system packages;
            builder = "${pkgs.bash}/bin/bash";
            outputs = [ "out" ];
            stdenv = pkgs.writeTextDir "setup" ''
              set -e

              for p in $packages; do
                PATH=$p/bin:$PATH
              done
            '';
          };
      });
    };
}
