import {List, Map} from 'immutable';

export interface Node {
    id: number;
}

export class Graph {
    private nodes: List<Node>;
    private children: Map<number, List<Node>>;
    private parents: Map<number, List<Node>>;

    constructor(nodes?: List<Node>, children?: Map<number, List<Node>>, parents?: Map<number, List<Node>>) {
        if (!nodes) {
            nodes = List<Node>();
        }

        if (!children) {
            children = Map<number, List<Node>>();
        }

        if (!parents) {
            parents = Map<number, List<Node>>();
        }

        this.nodes = nodes;
        this.children = children;
        this.parents = parents;
    }

    addNode(node: any) {
        var nodes = this.nodes.push(node);
        var children = this.children.set(node.id, List<any>());
        var parents = this.parents.set(node.id, List<any>());

        return new Graph(nodes, children, parents);
    }

    addConnection(parent: any, child: any, index?: number) {
        var children = this.addChild(parent, child, index);
        var parents = this.addAncestor(parent, child);

        return new Graph(this.nodes, children, parents);
    }

    removeNode(node: any) {
        var nodesAll = this.nodes.filter(n => n !== node).toList();
        var parentsAll: Map<number, List<Node>> = this.parents;
        var childrenAll: Map<number, List<Node>> = this.children;

        var parents = parentsAll.get(node.id);

        parents.forEach((parent) => {
            var children = childrenAll.get(parent.id);
            children = children.filter((child) => child !== node).toList();
            childrenAll = childrenAll.set(parent.id, children);
        });
        parentsAll = parentsAll.set(node.id, List<any>());

        var children = childrenAll.get(node.id);

        children.forEach((child) => {
            var parents = parentsAll.get(child.id);
            parents = parents.filter((ancestor) => ancestor !== node).toList();
            parentsAll = parentsAll.set(child.id, parents);
        });

        childrenAll = childrenAll.remove(node.id);

        return new Graph(nodesAll, childrenAll, parentsAll);
    }

    removeConnection(parent: any, child: any) {
        var parents = this.parents.get(child.id);
        var parentsAll = this.parents.set(child.id, parents.filter(ancestor => ancestor !== parent).toList());
        var children = this.children.get(parent.id);
        var childrenAll = this.children.set(parent.id, children.filter(ch => ch !== child).toList());

        return new Graph(this.nodes, childrenAll, parentsAll);
    }

    getChildren(node: any) {
        return this.children.get(node.id);
    }

    getParent(node: any) {
        var parents = this.parents.get(node.id);

        if (parents.size === 0) {
            return null;
        }

        return parents.get(0);
    }

    getParents(node: any) {
        return this.parents.get(node.id);
    }

    getNodes(filter: (node: any) => boolean) {
        if (!filter) {
            return this.nodes;
        }

        return this.nodes.filter(filter);
    }

    getNodeById(id: number) {
        return this.nodes.find(node => node.id === id);
    }

    private addChild(parent: any, child: any, index?: number) {
        var list: List<any> = this.children.get(parent.id);

        if (index === undefined) {
            index = list.size;
        }

        return this.children.set(parent.id, list.insert(index, child));
    }

    private addAncestor(parent: any, child: any) {
        var list: List<any> = this.parents.get(child.id);
        return this.parents.set(child.id, list.push(parent));
    }
}
