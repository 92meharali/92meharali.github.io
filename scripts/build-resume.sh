#!/bin/sh
# Compile resume PDF for the portfolio site.
# Requires: texlive-full or texlive-fonts-extra (for fontawesome5)
set -e
cd "$(dirname "$0")/.."
pdflatex -interaction=nonstopmode -output-directory=public complete_resume.tex
pdflatex -interaction=nonstopmode -output-directory=public complete_resume.tex
mv public/complete_resume.pdf public/resume.pdf
echo "Built public/resume.pdf"
