import Model from "./model.js";


export default class CollectionFilter extends Model{
    constructor(objects,params,model){
        super();

        this.addField('Name', 'string');
        this.addField('Category', 'string');
        this.addField('field', 'string');
        this.addField('ID', 'integer');
        this.addField('sort', 'string');

        this.objects = objects;
        this.model = model;
        this.Name = params.Name;
        this.Category = params.Category;
        this.field = params.field;
        this.ID = params.ID;
        this.sorting = params.sort;
        this.params = params;

        this.paramsToCheck = [];
        this.reponseName = [];
        this.reponseCategory = [];
        this.reponseID = [];
        this.mixedReponse = [];


        this.reponse = [];
    }

    CheckValidparams(){
        if(this.Name != null){
            this.paramsToCheck.push('Name');
        }
        if(this.Category != null){
            this.paramsToCheck.push('Category');
        }
        if(this.ID != null){
            this.paramsToCheck.push('ID');
        }
    }

    get(){
        if(this.params != null){
            this.CheckValidparams();
            if(this.paramsToCheck.length > 0){
                this.objects.forEach(element => {
                
                    for(let i = 0; i< this.paramsToCheck.length;i += 1){
                        let filtre = this.paramsToCheck[i];
                        switch (filtre){
                            case 'Name':
                                this.CheckName(element);
                                break;
                            case 'Category':
                                this.CheckCategory(element);
                                break;
                        }
                    }
                    
                });    
            }
            if(this.paramsToCheck.length > 1)
                this.CombineList();
            else
                this.MakeList();

            this.Sort();
        }
        return this.reponse;
    }


    CheckName(element){
        let indexStars = this.Name.indexOf('*');
        let lastIndexStars = this.Name.lastIndexOf('*');
        //determine si cherche nom global ou si juste contient parti
        if(indexStars > -1){
            //si etoiles au debut et a la fin on cherche ceux qui contiennent
            if(indexStars === 0 && lastIndexStars === this.Name.length -1){
                let substringValue = this.Name.toLowerCase().substring(1,this.Name.length -1);
                let resultCompare = element.Title.toLowerCase().includes(substringValue);
                if(resultCompare){
                    this.reponseName.push(element);
                }
            }
            //si etoiles au debut on cherche ceux commencant
            else if(indexStars != 0 && lastIndexStars === this.Name.length -1){
                if(element.Title.toLowerCase().startsWith(this.Name.toLowerCase().substring(0,this.Name.length -1))){
                    this.reponseName.push(element);
                }
            }
            //si etoiles a la fin on cherche ceux commencant
            else if(indexStars != 0 && lastIndexStars === this.Name.length -1){
                if(element.Title.toLowerCase().endsWith(this.Name.toLowerCase().substring(0,this.Name.length -1))){
                    this.reponseName.push(element);
                }
            }
        }
        //Si pas detoiles alors comparaison simple
        else{
            if(element.Title.toLowerCase() == this.Name.toLowerCase()){
                this.reponseName.push(element);
            }
        }
    }

    CheckCategory(element){
        if(element.Category.toLowerCase() == this.Category.toLowerCase()){
            this.reponseCategory.push(element);
        }
    }

    CombineList(){
        //Combine if Name && category
        if(this.reponseName.length != 0 && this.reponseCategory.length != 0){
            if(this.reponseName.length != 0){
                this.reponseName.forEach(element => {
                    if(this.reponseCategory.length != 0){
                        this.reponseCategory.forEach(elementCategory => {
                            if(element === elementCategory){
                                this.mixedReponse.push(element);
                            }
                        });
                    }
                    else{
                        this.mixedReponse.push(element);
                    }
                });
            }
        }
        

        //Combine if Name && category && id
        
    }

    Sort(){
        if(this.sorting != null){
            let sortType;
            if(this.sorting.includes(',')){
                let index = this.sorting.indexOf(',');
                sortType = this.sorting.substring(index +1);
                this.sorting = this.sorting.substring(0,index);
            }
            if(this.sorting === 'Name'){
                this.reponse = this.mixedReponse.sort(function(a,b){
                    return   sortType==="asc"? a.Title.localeCompare( b.Title): -( a.Title.localeCompare(  b.Title));
                });
            }
            if(this.sorting === 'Category'){
                this.reponse = this.mixedReponse.sort((a, b) => a.Category.toLowerCase().localeCompare(b.Category.toLowerCase()))
            }
            if(this.sorting === 'ID'){
                this.reponse = this.mixedReponse.sort((a, b) => a.Id.localeCompare(b.Id))
            }

            if(sortType === "desc"){
                this.reponse = this.mixedReponse.reverse();
            }
        }else{
            this.reponse = this.mixedReponse;
        }
    }

    compareName(a, b)
    {

    if (a.Title < b.Title) return -1;
    if (a.Title > b.Title) return 1;
    return 0;
    }

    MakeList(){
        let filtre = this.paramsToCheck[0];
        switch(filtre){
            case 'Name':
                this.reponseName.forEach(element => {
                    this.mixedReponse.push(element);
                });
                break;
            case 'Category':
                this.reponseCategory.forEach(element => {
                    this.mixedReponse.push(element);
                });
                break;
            case 'ID':
                this.reponseID.forEach(element => {
                    this.mixedReponse.push(element);
                });
                break;
            default:
                //pas de filtre
                this.mixedReponse.push(this.objects);
        }
    }
    innerCompare(x, y) {
        if ((typeof x) === 'string')
        return x.localeCompare(y);
        else
        return this.compareNum(x, y);
    }
}