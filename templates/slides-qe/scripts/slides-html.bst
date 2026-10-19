% Compact HTML output; standard BibTeX handles parsing and author names.
ENTRY { author title year url shortvenue } {} {}
INTEGERS { refnum }
FUNCTION {initialize} { #0 'refnum := }
FUNCTION {short.author}
{ author #1 "{vv }{ll}" format.name$
  author num.names$ #1 > { " et al." * } 'skip$ if$
}
FUNCTION {output.reference}
{ refnum #1 + 'refnum :=
  "<article class=" quote$ * "reference-entry" * quote$ *
  " data-bib-key=" * quote$ * cite$ * quote$ * ">" * write$ newline$
  "<span class=" quote$ * "reference-number" * quote$ * ">[" *
  refnum int.to.str$ * "]</span><div>" * write$ newline$
  "<p class=" quote$ * "reference-author" * quote$ * ">" * write$
  short.author write$ " (" write$ year write$ "). " write$
  shortvenue write$ ".</p>" write$ newline$
  "<p class=" quote$ * "reference-title" * quote$ * ">" * write$
  url empty$
    { title write$ "." write$ }
    { "<a href=" quote$ * url * quote$ * ">" * write$
      title write$ ".</a>" write$ }
  if$
  "</p></div></article>" write$ newline$
}
FUNCTION {inproceedings} { output.reference }
FUNCTION {misc} { output.reference }
FUNCTION {unpublished} { output.reference }
READ
EXECUTE {initialize}
ITERATE {call.type$}
