var toolbox = localStorage.toolbox;
var workspace = localStorage.workspace;
parser = new DOMParser();
var toolboxXml = parser.parseFromString(toolbox,"text/xml");
toolboxXml = toolboxXml.firstChild;
var workspaceXml = parser.parseFromString(workspace,"text/xml");
var script = document.createElement('script');
script.text = localStorage.blocks_text;
document.head.appendChild(script);
$(function () {
    /*var blockLibCategory = document.getElementById('blockLibCategory');
    toolboxXml.setAttribute('id','workspacefactory_toolbox');
    toolboxXml.setAttribute('class','toolbox');
    toolboxXml.appendChild(blockLibCategory);
    var previous_toolbox = document.getElementById('workspacefactory_toolbox');
    previous_toolbox.parentNode.replaceChild(toolboxXml,previous_toolbox);*/
    var workspace_toolbox = document.getElementById('workspacefactory_toolbox');
    merge_toolbox(workspace_toolbox,toolboxXml);
});

function merge_toolbox(previous,custom){
    var prev_childs = previous.children;
    var new_childs = custom.children;
    var i = 0;
    for(;i<new_childs.length;i++){
        console.log(new_childs[i]);
        var name;
        if (new_childs[i].tagName === 'category'){
            name = new_childs[i].getAttribute('name');
            var prev_cat = getCategoryName(prev_childs,name);
            if (prev_cat === null){
                previous.appendChild(new_childs[i].cloneNode(true));
            }
            else{
                merge_category(new_childs[i].cloneNode(true),prev_cat);
            }
        }
    }
};

function getCategoryName(xmlNodes,name){
    for(var i =0;i< xmlNodes.length; i ++){
        if(xmlNodes[i].tagName === 'category'){
            if(xmlNodes[i].getAttribute('name') === name){
                return xmlNodes[i];
            }
        }
    }
    return null;
}

function merge_category(previous,custom) {
    var prev_childs = previous.children;
    var new_childs = custom.children;
    for (var i = 0; i < new_childs.length; i ++){
        var type;
        if (new_childs[i].tagName === 'variables'){
            previous.appendChild(new_childs[i]);
        }
        else {
            if (new_childs[i].tagName === 'block') {
                type = new_childs[i].getAttribute('type');
                var prev_block = getBlockType(prev_childs,type);
                if (prev_block === null){
                    previous.appendChild(new_childs[i].cloneNode(true));
                }
                else {
                    previous.replaceChild(new_childs[i].cloneNode(true),prev_block);
                }
            }
        }
    }
}

function getBlockType(catNodes,type) {
    for (var i = 0; i < catNodes.length; i++){
        if (catNodes[i].tagName === 'block'){
            if (catNodes[i].getAttribute('type') === type){
                return catNodes[i];
            }
        }
    }
    return null;
}

function magic(s){
    var res ="";
    var t = s.split("\n");
    for (var i = 0;i< t.length;i++){
        res += t[i];
    }
    return res;
}


var blocklyFactory;
var init = function() {
  BlocklyDevTools.Analytics.init();

  blocklyFactory = new AppController();
  console.log(Blockly.Xml.domToPrettyText(blocklyFactory.workspaceFactoryController.generator.generateToolboxXml()));
  blocklyFactory.init();
  window.addEventListener('beforeunload', blocklyFactory.confirmLeavePage);
  document.getElementById('saveToINGI').addEventListener('click', function () {
      var xml_toolbox = Blockly.Xml.domToPrettyText(blocklyFactory.workspaceFactoryController.generator.generateToolboxXml());
      localStorage.toolbox = xml_toolbox;
      var xml_workspace = Blockly.Xml.domToPrettyText(blocklyFactory.workspaceFactoryController.generator.generateWorkspaceXml());
      localStorage.workspace = xml_workspace;
  });
};
window.addEventListener('load', init);
