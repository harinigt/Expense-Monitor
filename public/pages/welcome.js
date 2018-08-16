      $(function() {
             $( "#datepicker-13" ).datepicker({dateFormat: "yy-mm-dd"
                          
                                  });     
         });

          $(function() { $("#e2").daterangepicker({
                   datepickerOptions : {
                   numberOfMonths : 2
               }
          }); });

          
         $(document).ready(function(){ 

          document.querySelector("#createdon").valueAsDate = new Date();
          $("#toreturn").hide();
          $("#form1").hide();
          $("#viewform").hide();
          $("#trialtable").hide();

          $("#expenseformbutton").click(function(){
                $("#viewform").hide();
                 $("#trialtable").hide();
                $("#form1").fadeToggle("slow");

          });
          
          $('#viewexpensebutton').click(function(){
                $("#form1").hide();
                 $("#trialtable").hide();
                $("#viewform").fadeToggle("slow");

          });
         

         //expense form validation
          $('#addexpenseform').bootstrapValidator();

        //   $("#addexpenseform").submit(function(event){
        //         event.preventDefault();
                
                
        //          var store =  $('#store').html();
                
        //          var amount = $('#amount').val();
        //          var spenton = $('#spenton').val();
        //           var createdon = $('#createdon').val();
        //           var dataSend = {};
        //           dataSend.store = $('#store').val();
        //           dataSend.amount = $('#amount').val();
        //           dataSend.spenton =$('#datepicker-13').val();
        //           dataSend.createdon = $('#createdon').val();
        //          // var dataSend = { 'store' :store , 'amount' : amount };
        //           //'amount' : amount , 'spenton' : spenton , 'createdon' : createdon 
               
        //         $.ajax({
        //             type: 'POST',
        //             data: JSON.stringify(dataSend),
        //             ContentType: 'application/json',
        //             url: 'http://localhost:3000/addexpense',            
        //             success: function(data) {
                     
        //                  // alert("expense added")
        //                   console.log(JSON.stringify(data));
        //                    }
        //       });


        // }); 
// $("#addexpenseform").submit(function(event){
//         event.preventDefault();
//         var form  = $('#addexpenseform')[0];
//         var data = new FormData(form);
//         $.post("/addexpense", function(data){
//             $( ".result" ).html( JSON.stringify(data) );
//         });
//     });

          $("#formoid").submit(function(event) {
               event.preventDefault();
               var data = $('#e2').val(data);
               
               $.ajax({
                    type: 'POST',
                    data:  {'data': data},
                    ContentType: 'application/json',
                    url: 'http://localhost:3000/viewexpense',            
                        success: function(data) {
                          var obj = JSON.parse(data);
                          console.log(obj);
                          var object =  {'objectr': obj};
                          var total = 0;
                          for (i = 0; i < obj.length; i++) { 
                                 total += obj[i].amount;  
                               }
                          var template = $("#mp_template").html();
                          var text = Mustache.render(template, object);
                         
                          
                          console.log(total);
                    //$("#trialtable").html(text);
                    // $("#total").html(total);
                    // $('tr td:nth-child(1)').hide();
                     //$("#trialtable").fadeToggle("slow");



      var tbl ='';

      tbl+='<table class = "table table-responsive-lg">';
      tbl+='<tr>';
      tbl+='<th scope="col" class="text-white bg-success expensetable">STORE</th><th scope="col" class="text-white bg-success expensetable">ITEM</th><th scope="col" class="text-white bg-success expensetable">AMOUNT</th><th scope="col" class="text-white bg-success expensetable">PURCHASE DATE</th><th scope="col" class="text-white bg-success expensetable">CATEGORY</th><th scope="col" class="text-white bg-success expensetable">TO RETURN</th><th scope="col" class="text-white bg-success expensetable">NOTES</th><th scope="col" class="text-white bg-success expensetable">RECEIPT</th><th scope="col" class="text-white bg-success expensetable">Options</th>' ;
                     //trying editable table : 
    $.each(obj, function(index, val) 
      {
        
        var row_id = obj[index].expenseid;
        var return_mark = ""
        if(obj[index].toreturn===0)
        {
          return_mark="No" ;
        } else
        {
           return_mark="Yes" ;
        }
       
        //loop through ajax row data
        tbl +='<tr row_id="'+row_id+'">';
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="store">'+obj[index].Store+'</div></td>';
          tbl +='<td ><div class="row_data text-white expensetable" edit_type="click" col_name="item">'+obj[index].item+'</div></td>';
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="amount">'+obj[index].amount+'</div></td>';
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="purchasedate">'+obj[index].purchasedate+'</div></td>';
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="category">'+obj[index].category+'</div></td>';
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="toreturn">'+return_mark+'</div></td>';
          
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="notes">'+obj[index].notes+'</div></td>'; 
          tbl +='<td ><div class="text-white expensetable " edit_type="click" col_name="receiptimg"><a class="button btn btn-success btnn_try" href="'+obj[index].receiptimg+'"'+'+>View</a></div></td>';
          //--->edit options > start
          tbl +='<td>';
           
          tbl +='<a href="#" class=" button btn btn-success text-white expensetable  btn_edit btnn_try" row_id="'+row_id+'" > Edit</a>';

            //only show this button if edit button is clicked
            tbl +='<a href="#" class=" button btn btn-success text-white expensetable btnn_try btn_save" row_id="'+row_id+'" > Save</a>';
          // tbl +='<span class="btn_save text-white expensetable btn btn-success btn-sm" id="save"> <a href="#" class="btn text-white expensetable"  row_id="'+row_id+'"> Save</a> </span>';
          tbl +='<a href="#" class=" button btn btn-success text-white expensetable btnn_try btn_cancel" row_id="'+row_id+'" > Cancel</a>';
          // tbl +='<span class="btn_cancel text-white expensetable btn btn-success btn-sm"> <a href="#" class="btn text-white expensetable" row_id="'+row_id+'"> Cancel</a> </span>';

          tbl +='</td>';
          //--->edit options > end
          
        tbl +='</tr>';
        
      });
           
tbl +='</table>'
           $("#trialtable").html(tbl); 
           $("#trialtable").fadeToggle("slow");     
           $(document).find('.btn_save').hide();
           $(document).find('.btn_cancel').hide();   


//                      //--->make div editable > start
//           $(document).on('click', '.row_data', function(event) 
//           {
//             event.preventDefault(); 

//             if($(this).attr('edit_type') == 'button')
//             {
//               return false; 
//             }

//             //make div editable
//             $(this).closest('div').attr('contenteditable', 'true');
//             //add bg css
//             $(this).addClass('bg-gradient-info').css('padding','3px');

//             $(this).focus();
//           })  
// //--->make div editable > end  


//--->button > edit > start 
$(document).on('click', '.btn_edit', function(event) 
{
  event.preventDefault();
  var tbl_row = $(this).closest('tr');

  var row_id = tbl_row.attr('row_id');

  tbl_row.find('.btn_save').show();
  tbl_row.find('.btn_cancel').show();

  //hide edit button
  tbl_row.find('.btn_edit').hide(); 

  //make the whole row editable
  tbl_row.find('.row_data')
  .attr('contenteditable', 'true')
  .attr('edit_type', 'button')
  .addClass('bg-gradient-info')
  .css('padding','3px')

  //--->add the original entry > start
  tbl_row.find('.row_data').each(function(index, val) 
  {  
    //this will help in case user decided to click on cancel button
    $(this).attr('original_entry', $(this).html());
  });     
  //--->add the original entry > end

});

   //--->button > cancel > start  
$(document).on('click', '.btn_cancel', function(event) 
{
  event.preventDefault();

  var tbl_row = $(this).closest('tr');

  var row_id = tbl_row.attr('row_id');

  //hide save and cacel buttons
  tbl_row.find('.btn_save').hide();
  tbl_row.find('.btn_cancel').hide();

  //show edit button
  tbl_row.find('.btn_edit').show();

  //make the whole row editable
  tbl_row.find('.row_data')
  .attr('contenteditable', 'false')
  .attr('edit_type', 'button')
  .removeClass('bg-gradient-info')
  .css('padding','')

  // //make the whole row editable
  // tbl_row.find('.row_data')
  // .attr('edit_type', 'click')  
  // .removeClass('bg-gradient-info')
  // .css('padding','') 

  tbl_row.find('.row_data').each(function(index, val) 
  {   
    $(this).html( $(this).attr('original_entry') ); 
  });  
});
//--->button > cancel > end



//--->save whole row entery > start 
$(document).on('click', '.btn_save', function(event) 
{
  event.preventDefault();
  var tbl_row = $(this).closest('tr');

  var row_id = tbl_row.attr('row_id');

  
  //hide save and cacel buttons
  tbl_row.find('.btn_save').hide();
  tbl_row.find('.btn_cancel').hide();

  //show edit button
  tbl_row.find('.btn_edit').show();


  //make the whole row editable
  tbl_row.find('.row_data')
  .attr('edit_type', 'click') 
  .removeClass('bg-gradient-info')
  .css('padding','') 

  //--->get row data > start
  var arr = {}; 
  tbl_row.find('.row_data').each(function(index, val) 
  {   
    var col_name = $(this).attr('col_name');  
    var col_val  =  $(this).html();
    if(col_name === "toreturn" &&  col_val ==="Yes"){
      col_val = 1;
    }
    arr[col_name] = col_val;
  });
  //--->get row data > end
   
   console.log(arr);
  //use the "arr" object for your ajax call
  $.extend(arr, {row_id:row_id});
   $.ajax({
                    type: 'POST',
                    data:  {'data': arr},
                    ContentType: 'application/json',
                    url: 'http://localhost:3000/updateexpense',            
                        success: function(data) {

                          console.log(data);

                        }

           });

  //out put to show
  
  //console.log(arr);
   

});
//--->save whole row entery > end

                           
                        }
                    });
       
      });
        
    }) 