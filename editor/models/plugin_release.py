import os
import os.path
import urllib2
import zipfile
import tarfile
import fnmatch
from gzip import open as gzopen
import shutil
from gluon.sqlhtml import form_factory

jn = os.path.join
##########################################
# if you want this application to be the release server you must once call the core_release or full_release function
# http://127.0.0.1:8000/pyMantis/plugin_release/core_release
# to do this you must belong to the group "admin"
##########################################
#config
APPLICATION_NAME = 'biographer'
RELEASE_FOLDER = os.path.join(request.folder, 'private', 'release')
#this is the URL where the main app resides from which updates can be pulled
APPLICATION_URL = "http://biographer.biologie.hu-berlin.de/biographer"
WEB2PY_URL = 'http://web2py.com'
WEB2PY_VERSION_URL = WEB2PY_URL+'/examples/default/version'
IGNORE_PATTERNS = ('*BIOMD*', '*web2py.app.*', '*.sw?', '*~', '*.pyc', 'CVS', '^.git', '.svn', '*%s_*.zip'%APPLICATION_NAME, '*%s_*.tar*'%APPLICATION_NAME)
##########################################
'''
if auth.has_membership('admin'):
    response.menu.append((LOAD('plugin_release', 'check_version', ajax = True), False, URL(request.application, 'plugin_release', 'status'), []))
if os.path.exists(RELEASE_FOLDER):
    response.menu.append((T('Download'), False, URL(request.application,'plugin_release','download'), []))
'''
