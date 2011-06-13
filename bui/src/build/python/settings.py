#!/usr/bin/env python2.6
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

__authors__ = [
    '"Ben Ripkens" <bripkens.dev@gmail.com>',
]

import os

# relative to the root directory
main_src_dir = os.path.join('src', 'main', 'javascript')
target_dir = 'target'

# relative to main_src_dir
nodes_sub_dir = 'nodes'
edges_sub_dir = 'edges'
modules = ['intro',
           'settings.js',
           'core.js',
           'util.js',
           'observable.js',
           'graph.js',
           'drawable.js',
           'node.js',
           'labelable.js',
           os.path.join(nodes_sub_dir,'sbgnnode.js'),
           os.path.join(nodes_sub_dir,'unspecifiedEntity.js'),
           os.path.join(nodes_sub_dir,'simpleChemical.js'),
           os.path.join(nodes_sub_dir,'rectangularNode.js'),
           os.path.join(nodes_sub_dir,'nucleicAcidFeature.js'),
           os.path.join(nodes_sub_dir,'macromolecule.js'),
           os.path.join(nodes_sub_dir,'stateVariable.js'),
           os.path.join(nodes_sub_dir,'complex.js'),
           os.path.join(nodes_sub_dir,'compartment.js'),
           os.path.join(nodes_sub_dir,'unitOfInformation.js'),
           os.path.join(nodes_sub_dir,'dragHandle.js'),
           os.path.join(nodes_sub_dir,'process.js'),
           os.path.join(edges_sub_dir,'attachedDrawable.js'),
           os.path.join(edges_sub_dir,'straightLine.js'),
           'outro']


# relative to target_dir
combined_file = 'biographer-ui.js'
jsdoc_dir = 'jsdoc'
test_dir = 'test'

# combining all dirs
for i, module in enumerate(modules):
    modules[i] = os.path.join(main_src_dir, module)

combined_file = os.path.join(target_dir, combined_file)
jsdoc_dir = os.path.join(target_dir, jsdoc_dir)
test_dir = os.path.join(target_dir, test_dir)


# jsdoc command
jsdoc_install_dir = 'src/build/lib/jsdoc-toolkit'
jsdoc_jsrun = os.path.join(jsdoc_install_dir, 'jsrun.jar')
jsdoc_apprun = os.path.join(jsdoc_install_dir, 'app/run.js')
jsdoc_template = os.path.join(jsdoc_install_dir, 'templates/jsdoc')

jsdoc_command = 'java -jar %s %s -a -t=%s -d=%s %s' % (jsdoc_jsrun,
                                                       jsdoc_apprun,
                                                       jsdoc_template,
                                                       jsdoc_dir,
                                                       combined_file)

# jslint command
jslint_command = 'node src/build/javascript/jslint-check.js'

# compress command
compress_command = 'node src/build/javascript/compress.js'
