for pdf in *.pdf; do
	pdftoppm -png -f 1 -l 1 -r 300 "$pdf" "${pdf%.pdf}"
done
