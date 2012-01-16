#!/usr/bin/python
# -*- coding: iso-8859-15 -*-

import sys
hardcoded = request.folder + "/modules"
if not hardcoded in sys.path:
	sys.path.append(hardcoded)

from graph import Graph

import os
from copy import deepcopy

#
# the following lines are not necessary,
# since all in /models is imported automatically by web2py
#
#from cache import *
#from biomodels import *
#from reactome import *

def reset_current_session():
	global session

	session.JSON = None				# reset
	session.SBML = None
	session.BioModelsID = None

	if session.bioGraph is not None:		# delete old graph
		del session.bioGraph

	from graph import Graph
	session.bioGraph = Graph()			# new graph


def import_JSON( JSONstring ):
	global session
	reset_current_session()
	session.bioGraph.importJSON( JSONstring )


def import_SBML( SBMLstring ):
	global session
	reset_current_session()
	session.bioGraph.importSBML( SBMLstring )


def import_BioModel( BioModelsID ):
	global session, request, db

	BioModelsID = BioModelsID.rjust(10, "0")			# adjust BioModel's ID
	print "BioModel requested: BIOMD"+BioModelsID

	model = BioModel_from_cache( BioModelsID )
	if model is None:
		print "Not in cache. Downloading ..."
		model = download_BioModel( BioModelsID )
		if model is None:
			print "Error: Download failed"
			session.flash = "Error: BioModel download failed"
			return False
		else:
			print "Downloaded successful."
			session.flash = "BioModel downloaded"
			BioModel_to_cache( model, BioModelsID )
	else:
		print "Loaded from cache."
		session.flash = "BioModel loaded from cache"
	
	reset_current_session()
	session.BioModelsID = BioModelsID
	session.SBML = model
	session.bioGraph.importSBML( session.SBML )
	return model


def import_Reactome( ReactomeStableIdentifier ):
	global session, request, db

	print "Request for RSI:"+ReactomeStableIdentifier

	model = Reactome_from_cache( ReactomeStableIdentifier )
	if model is None:
		print "Not in cache. Downloading ..."
		model = download_Reactome( ReactomeStableIdentifier )
		if model is None:
			print "Error: Download failed"
			session.flash = "Error: Reactome download failed"
			return False
		else:
			print "Downloaded successful."
			session.flash = "Reactome model downloaded"
			Reactome_to_cache( model, ReactomeStableIdentifier )
	else:
		print "Loaded from cache."
		session.flash = "Reactome model loaded from cache"

	reset_current_session()
	session.ST_ID = ReactomeStableIdentifier
	session.SBML = model
	session.bioGraph.importSBML( session.SBML )
	return model


def import_Layout(graph, lines):
    type2sbo = dict(Protein = 252,SimpleCompound=247,Complex=253,Reaction=167,Compartment=290,Compound=285)
    nodeh={}#nodeid to index
    for cc,node in enumerate(graph['nodes']):
      nodeh[node['id']] = cc

    minx=1000000000000000000
    miny=1000000000000000000
    i = 0
    while i < len(lines):
        node_type=lines[i+1].strip()
        node_id=lines[i+2].strip()
        compartment=lines[i+3].strip()
        x=float(lines[i+4].strip())
        y=float(lines[i+5].strip())
        w=float(lines[i+6].strip())
        h=float(lines[i+7].strip())
        i+=9
        print 'node_type: ',node_type,'node_id',node_id,'compartment',compartment,'x',x,'y',y,'w',w,'h',h

        if node_id not in nodeh:
            print 'continue id not in nodeh'
            continue

        if node_type == 'Compartment':
            graph['nodes'][nodeh[node_id]]['data']['x'] = 1*x
            graph['nodes'][nodeh[node_id]]['data']['y'] = -y-h
            graph['nodes'][nodeh[node_id]]['data']['width'] = 1*w
            graph['nodes'][nodeh[node_id]]['data']['height'] = 1*h
        elif node_type in type2sbo:
            graph['nodes'][nodeh[node_id]]['data']['x'] = 1*x-w/2
            graph['nodes'][nodeh[node_id]]['data']['y'] = -y-h/2
        else:
            print 'eeeerrroroor'
            raise HTTP(500, 'nooo')

        if graph['nodes'][nodeh[node_id]]['data']['x'] < minx:
            minx= graph['nodes'][nodeh[node_id]]['data']['x']
        if graph['nodes'][nodeh[node_id]]['data']['y'] < miny:
            miny= graph['nodes'][nodeh[node_id]]['data']['y']

    for node in graph['nodes']:
        if node['data'].has_key('x'):
            node['data']['x'] -= minx
        if node['data'].has_key('y'):
            node['data']['y'] -= miny
    #node_id2node = dict([(node['id'],node) for node in graph['nodes']])
    for node in graph['nodes']:
        print node
        if node['data'].has_key('compartment') and node['data']['compartment']:
            cp = nodeh[node['data']['compartment']]
            node['data']['x'] -= graph['nodes'][cp]['data']['x']
            node['data']['y'] -= graph['nodes'][cp]['data']['y']
