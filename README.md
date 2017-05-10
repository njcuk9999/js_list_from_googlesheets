# js_list_from_googlesheets
Create a html list from a google spreadsheet


## Use in html/php

1. Load jquery and list_from_googlespreadsheet.js

  ### HTML Code: 
      <!-- Requires jquery and the list_from_googlespreadsheet.js -->
      <script src="jquery-1.12.3.js"></script>
      <script type="text/javascript" src="list_from_googlespreadsheet.js"></script>
  
2. Once per page load the spreadsheet containing the links to add

  NOTE: googesheet must contain the following columns:
    - "tag"
    - "section"
    - "listtarget"
    - "desc"
    - "listurl"
    - "notes"
    
  ### HTML Code: 
      <!-- Load the spreadsheet once per page -->
      <script type="text/javascript">
        var thedatatable = [];
        var spreadsheetkey = "12W99mv2eN0ZX2P1t6jP3_oZUL2JF5BJqL5BI7CVVdfU";
        thedatatable = makeList(spreadsheetkey);
      </script>
  
3. For each list on a page need to define a placeholder with an id equal to the "tag" in the googlesheet
  
  ### HTML Code: 
      <!-- List 1 -->
      <p id="item-key1">	List loading... Please wait  </p>

      <!-- Get all items in spread sheet and create list in <p> with id="item-key1" -->
      <script type="text/javascript">
        var id = "item-key1";
        filterList(id, thedatatable);
      </script>

      <!-- List 2 -->
      <p id="item-key2">	List loading... Please wait  </p>
  
      <!-- Get all items in spread sheet and create list in <p> with id="item-key2" -->
      <script type="text/javascript">
        var id = "item-key2";
        filterList(id, thedatatable);
      </script>
  
4. Google sheet setup:

    columns:
    - tag         string, the key for the list
    - section     string, the title for the list
    - listtarget  string, the "target" for the list item
    - desc        string, text associated with the list item
    - listurl     string, url of the list item
    - notes       string, text assocaited with a a subitem, if none no subitem is created
    
5. HTML created:
    (variables are noted with $  i.e. $section, $listurl etc)
      
    when notes is not None:
    
           <div class="w3-container w3-text-black w3-large">
              $section
           </div>
           <ul>
           <li><a target="$target" href="$listurl">$desc$</a>
               <div class="w3-container w3-text-brown w3-small">
               $note</div>
           </li>
           ...
           </ul></div>
       
       
     when notes is None:
     
         <div class="w3-container w3-text-black w3-large">
            $section
         </div>
         <ul>
         <li><a target="$target" href="$listurl">$desc$</a>
             <div class="w3-container w3-text-brown w3-small">
             $note</div>
         </li>
         ...
         </ul></div>
      
       


