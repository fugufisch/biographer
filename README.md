#biographer

<p align="justify">is a biological network layout and visualization tool which
has been developed at the <a href="http://www2.hu-berlin.de/biologie/theorybp/">      Theoretical Biophysics Group</a> in Berlin as part of the Google Summer of Code
2011.</p>

<p align="justify">It consists of a layout algorithm C/C++ library
(_biographer-layout_) which creates an graph layout optimized for biological
networks, especially for bi-partite reaction graphs and a Javascript web
component (_biographer-visualization_) for interactive in-browser
visulalization of those networks. A server component (_biographer-server_) puts
all sub projects together and provides network import from various sources and
subsequent visualization.</p>

<p align="justify">The <a href="http://code.google.com/p/biographer/wiki/index?tm=6">project wiki</a> gives detailed descriptions on the sub projects and contains the
build instructions.</p>

<p align="justify">The current version of the
<a href="http://biographer.biologie.hu-berlin.de">editor</a> provides import and export
functions as well as editing and visualization options. If the editor is not available through biographer.biologie.hu-berlin.de alternatively you can reach it under <a href="http://semanticsbml.org/biographer">http://semanticsbml.org/biographer</a></p>

<p align="justify"><a href="http://cheetah.biologie.hu-berlin.de/networkexplorer">NetworkExplorer</a> is a project demo which visualizes the Network data from the
<a href="http://www.reactome.org">Reactome</a> and <a href="http://pid.nci.nih.gov">PID</a> databases.
The network can be explored by clicking through the different pathways.</p>

<br/>

</p>

## jSBGN
biographer is based on jSBGN, a lightweight JSON network exchange format which lies between biological model description languages like <a href="http://sbml.org/">SBML</a> and full glyph describing languages like <a href="http://libsbgn.sourceforge.net">SBGN-ML</a> or SVG. The jSBGN definition can be found <a href="http://code.google.com/p/biographer/wiki/graph_exchange">here</a>. biographer can handle SBML and SBGN-ML through the <a href="https://github.com/chemhack/libSBGN.js">jSBGN.js</a> library

## Contact
<p align="justify">If you have questions about the project you can contact us
via the public mailing list biographer@googlegroups.com. If you would like to
contact the developers directly please use biographer-dev@googlegroups.com.</p>

## Contributors
</p>The following people contributed to the Biographer project in various ways.

<ul>
<li>Thomas Handorf</li>
<li>Marvin Schulz</li>
<li>Falko Krause</li>
<li>Matthias Bock</li>
<li><a href="http://www.bripkens.de">Ben Ripkens</a></li>
<li>Acer Wei Jing</li>
<li>Max Flöttmann</li>
<li>Till Scharp</li>
<li>Taye Adeyemi</li>
<li>Lian Duan</li>
<li>Chaitanya Talnikar</li>

</ul>
</div>
