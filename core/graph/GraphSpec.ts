import {Graph} from './Graph';

describe('Graph', function() {
    var graph;

    beforeEach(function() {
        graph = new Graph();
    });

    describe('addNode', function() {
        it('should add the node to the graph', function() {
            var node1 = {id: 1};
            var node2 = {id: 2};

            graph = graph.addNode(node1);
            graph = graph.addNode(node2);

            var nodes = graph.getNodes();

            expect(nodes.size).toEqual(2);
            expect(nodes.get(0)).toEqual(node1);
            expect(nodes.get(1)).toEqual(node2);
        });
    });

    describe('addConnection', function() {
        it('should set the child relation correctly', function() {
            var node1 = {id: 1};
            var node2 = {id: 2};

            graph = graph.addNode(node1);
            graph = graph.addNode(node2);

            graph = graph.addConnection(node1, node2);

            var children = graph.getChildren(node1);

            expect(children.size).toEqual(1);
            expect(children.get(0)).toEqual(node2);
        });

        it('should set the ancestors relation correctly', function() {
            var node1 = {id: 1};
            var node2 = {id: 2};

            graph = graph.addNode(node1);
            graph = graph.addNode(node2);

            graph = graph.addConnection(node1, node2);

            var parent = graph.getParent(node2);
            var ancestors = graph.getParents(node2);

            expect(parent).toEqual(node1);
            expect(ancestors.size).toEqual(1);
            expect(ancestors.get(0)).toEqual(node1);
        });

        it('should be able to insert the child to an arbitrary position', function() {
            var node1 = {id: 1};
            var node2 = {id: 2};
            var node3 = {id: 3};
            var node4 = {id: 4};

            graph = graph.addNode(node1);
            graph = graph.addNode(node2);
            graph = graph.addNode(node3);
            graph = graph.addNode(node4);

            graph = graph.addConnection(node1, node2);
            graph = graph.addConnection(node1, node3);
            graph = graph.addConnection(node1, node4, 1);

            var children = graph.getChildren(node1);

            expect(children.size).toEqual(3);
            expect(children.get(0)).toEqual(node2);
            expect(children.get(1)).toEqual(node4);
            expect(children.get(2)).toEqual(node3);
        });
    });

    describe('removeNode', function() {
        it('should remove the node from the node list', function() {
            var node1 = {id: 1};
            var node2 = {id: 2};

            graph = graph.addNode(node1);
            graph = graph.addNode(node2);

            graph = graph.removeNode(node1);

            var nodes = graph.getNodes();

            expect(nodes.size).toEqual(1);
            expect(nodes.get(0)).toEqual(node2);
        });

        it('should set the child relation correctly', function() {
            var node1 = {id: 1};
            var node2 = {id: 2};

            graph = graph.addNode(node1);
            graph = graph.addNode(node2);

            graph = graph.addConnection(node1, node2);
            graph = graph.removeNode(node2);

            var children = graph.getChildren(node1);

            expect(children.size).toEqual(0);
        });

        it('should set the ancestors relation correctly', function() {
            var node1 = {id: 1};
            var node2 = {id: 2};

            graph = graph.addNode(node1);
            graph = graph.addNode(node2);

            graph = graph.addConnection(node1, node2);
            graph = graph.removeNode(node1);

            var parent = graph.getParent(node2);
            var ancestors = graph.getParents(node2);

            expect(parent).toEqual(null);
            expect(ancestors.size).toEqual(0);
        });
    });

    describe('removeConnection', function() {
        it('should remove the child from the parent\'s children list', function() {
            var node1 = {id: 1};
            var node2 = {id: 2};
            var node3 = {id: 3};

            graph = graph.addNode(node1);
            graph = graph.addNode(node2);
            graph = graph.addNode(node3);

            graph = graph.addConnection(node1, node2);
            graph = graph.addConnection(node1, node3);

            graph = graph.removeConnection(node1, node2);

            expect(graph.getChildren(node1).size).toEqual(1);
            expect(graph.getChildren(node1).get(0)).toEqual(node3);
        });

        it('should remove the parent from the childs\'s ancestors list', function() {
            var node1 = {id: 1};
            var node2 = {id: 2};
            var node3 = {id: 3};

            graph = graph.addNode(node1);
            graph = graph.addNode(node2);
            graph = graph.addNode(node3);

            graph = graph.addConnection(node2, node1);
            graph = graph.addConnection(node3, node1);

            graph = graph.removeConnection(node2, node1);

            expect(graph.getParents(node1).size).toEqual(1);
            expect(graph.getParents(node1).get(0)).toEqual(node3);
        });
    });
});
