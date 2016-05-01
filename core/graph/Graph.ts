import {List, Map} from 'immutable';

export interface Node {
    id: number;
}

export class Graph {
    private nodes: List<Node>;
    private children: Map<number, List<Node>>;
    private ancestors: Map<number, List<Node>>;

    constructor(nodes?: List<Node>, children?: Map<number, List<Node>>, ancestors?: Map<number, List<Node>>) {
        if (!nodes) {
            nodes = List<Node>();
        }

        if (!children) {
            children = Map<number, List<Node>>();
        }

        if (!ancestors) {
            ancestors = Map<number, List<Node>>();
        }

        this.nodes = nodes;
        this.children = children;
        this.ancestors = ancestors;
    }

    addNode(node: any) {
        var nodes = this.nodes.push(node);
        var children = this.children.set(node.id, List<any>());
        var ancestors = this.ancestors.set(node.id, List<any>());

        return new Graph(nodes, children, ancestors);
    }

    addConnection(parent: any, child: any, index?: number) {
        var children = this.addChild(parent, child, index);
        var ancestors = this.addAncestor(parent, child);

        return new Graph(this.nodes, children, ancestors);
    }

    removeNode(node: any) {
        var nodesAll = this.nodes.filter(n => n !== node).toList();
        var ancestorsAll: Map<number, List<Node>> = this.ancestors;
        var childrenAll: Map<number, List<Node>> = this.children;

        var ancestors = ancestorsAll.get(node.id);

        ancestors.forEach((parent) => {
            var children = childrenAll.get(parent.id);
            children = children.filter((child) => child !== node).toList();
            childrenAll = childrenAll.set(parent.id, children);
        });
        ancestorsAll = ancestorsAll.set(node.id, List<any>());

        var children = childrenAll.get(node.id);

        children.forEach((child) => {
            var ancestors = ancestorsAll.get(child.id);
            ancestors = ancestors.filter((ancestor) => ancestor !== node).toList();
            ancestorsAll = ancestorsAll.set(child.id, ancestors);
        });

        childrenAll = childrenAll.remove(node.id);

        return new Graph(nodesAll, childrenAll, ancestorsAll);
    }

    removeConnection(parent: any, child: any) {
        var ancestors = this.ancestors.get(child.id);
        var ancestorsAll = this.ancestors.set(child.id, ancestors.filter(ancestor => ancestor !== parent).toList());
        var children = this.children.get(parent.id);
        var childrenAll = this.children.set(parent.id, children.filter(ch => ch !== child).toList());

        return new Graph(this.nodes, childrenAll, ancestorsAll);
    }

    getChildren(node: any) {
        return this.children.get(node.id);
    }

    getParent(node: any) {
        var ancestors = this.ancestors.get(node.id);

        if (ancestors.size === 0) {
            return null;
        }

        return ancestors.get(0);
    }

    getAncestors(node: any) {
        return this.ancestors.get(node.id);
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
        var list: List<any> = this.ancestors.get(child.id);
        return this.ancestors.set(child.id, list.push(parent));
    }
}
