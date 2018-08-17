    // The Javascript for all the expense loading and retreiving

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
          $('#returns').hide();

          //add expenses button

          $("#expenseformbutton").click(function(){
                $('#returns').hide();
                $("#welcomecontent").hide();
                $("#viewform").hide();
                 $("#trialtable").hide();
                $("#form1").fadeToggle("slow");

          });

          //view and edit expenses
          
          $('#viewexpensebutton').click(function(){
                $('#returns').hide();
                $("#welcomecontent").hide();
                $("#form1").hide();
                $("#trialtable").hide();
                $("#viewform").fadeToggle("slow");

          });

          //returns 
          $('#viewreturnsbutton').click(function(){
                $("#form1").hide();
                 $("#viewform").hide();
                  $("#welcomecontent").hide();
                 $("#trialtable").hide();
                 $.ajax({
                    type: 'GET',
                    ContentType: 'application/json',
                    url: 'http://localhost:3000/returns',            
                    success: function(data) {
                      var tbl="";
                      var obj = JSON.parse(data);
                      tbl+='<table class = "table table-responsive-sm">';
         tbl+='<tr>';
         tbl+='<th scope="col" class="text-white bg-success expensetable">STORE</th><th scope="col" class="text-white bg-success expensetable">ITEM</th><th scope="col" class="text-white bg-success expensetable">AMOUNT</th><th scope="col" class="text-white bg-success expensetable">RECEIPT</th>' ;
        var total =0;
        $.each(obj, function(index, val) 
          {
          tbl +='<tr >';
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="store">'+obj[index].storename+'</div></td>';
          tbl +='<td ><div class="row_data text-white expensetable" edit_type="click" col_name="item">'+obj[index].item+'</div></td>';
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="amount">'+obj[index].amount+'</div></td>';
          tbl +='<td ><div class="text-white expensetable " edit_type="click" col_name="receiptimg"><a class="button btn btn-success btnn_try" href="'+obj[index].receiptimg+'"'+'+><i class="fa fa-file-photo-o" style="font-size:24px"></a></div></td>';
          tbl +='</tr>';

          total += obj[index].amount;

           });
           tbl +='</table>';

          
           $("#returnstable").html(tbl); 
           $("#totalinreturns").html(total); 
           $("#returns").fadeToggle("slow"); 

                  }

          });
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
               var data = $('#e2').val()
               $.ajax({
                    type: 'POST',
                    data:  {'data': data},
                    ContentType: 'application/json',
                    url: 'http://localhost:3000/viewexpense',            
                        success: function(data) {
                          console.log(data);
                          var obj = JSON.parse(data);
                          console.log(obj);
                    
      var tbl ='';

      tbl+='<table class = "table table-responsive-lg" id="expensestable">';
      tbl+='<tr>';
      tbl+='<th scope="col" class="text-white bg-success expensetable">STORE</th><th scope="col" class="text-white bg-success expensetable">ITEM</th><th scope="col" class="text-white bg-success expensetable">AMOUNT</th><th scope="col" class="text-white bg-success expensetable">PURCHASE DATE</th><th scope="col" class="text-white bg-success expensetable">CATEGORY</th><th scope="col" class="text-white bg-success expensetable">TO RETURN</th><th scope="col" class="text-white bg-success expensetable">NOTES</th><th scope="col" class="text-white bg-success expensetable">RECEIPT</th><th scope="col" class="text-white bg-success expensetable">Options</th>' ;

                    
    $.each(obj, function(index, val) 
      {
        
        var row_id = obj[index].expenseid;
        var return_mark = ""
        if(obj[index].toreturn==='1'){
          return_mark='yes';
        }else if(obj[index].toreturn==='0'){
          return_mark='no';
        }
       
       
        tbl +='<tr row_id="'+row_id+'">';
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="store">'+obj[index].storename+'</div></td>';
          tbl +='<td ><div class="row_data text-white expensetable" edit_type="click" col_name="item">'+obj[index].item+'</div></td>';
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="amount">'+obj[index].amount+'</div></td>';
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="purchasedate">'+obj[index].purchasedate+'</div></td>';
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="category">'+obj[index].category+'</div></td>';
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="toreturn">'+return_mark+'</div></td>';
          
          tbl +='<td ><div class="text-white expensetable row_data" edit_type="click" col_name="notes">'+obj[index].notes+'</div></td>'; 
          tbl +='<td ><div class="text-white expensetable " edit_type="click" col_name="receiptimg"><a class="button btn btn-success btnn_try" href="'+obj[index].receiptimg+'"'+'+><i class="fa fa-file-photo-o" style="font-size:24px"></i></a></div></td>';
         
          tbl +='<td>';
           
          tbl +='<a href="#" class=" button btn btn-success text-white expensetable  btn_edit btnn_try" row_id="'+row_id+'" ><i class="fa fa-edit" style="font-size:24px"></i></a>';

           
          tbl +='<a href="#" class=" button btn btn-success text-white expensetable btnn_try btn_save" row_id="'+row_id+'" > <i class="fa fa-save" style="font-size:24px"></i></a>';
          tbl +='<a href="#" class=" button btn btn-success text-white expensetable btnn_try btn_cancel" row_id="'+row_id+'" > <i class="fa fa-close" style="font-size:24px"></i></a>';
          tbl +='<a href="#" class=" button btn btn-success text-white expensetable btnn_try btn_remove" row_id="'+row_id+'" > <i class="fa fa-trash" style="font-size:24px"></i></a>';
          tbl +='</td>';
        
          
        tbl +='</tr>';
        
      });
           
       tbl +='</table>'
           $("#trialtable").html(tbl); 
           $("#trialtable").fadeToggle("slow");     
           $(document).find('.btn_save').hide();
           $(document).find('.btn_cancel').hide(); 
           $(document).find('.btn_remove').hide(); 
          
                          $(document).on('click', '.btn_edit', function(event) 
                          {
                            event.preventDefault();
                            var tbl_row = $(this).closest('tr');

                            var row_id = tbl_row.attr('row_id');

                            tbl_row.find('.btn_save').show();
                            tbl_row.find('.btn_cancel').show();
                            tbl_row.find('.btn_remove').show();
                            tbl_row.find('.btn_edit').hide(); 
                            tbl_row.find('.row_data')
                            .attr('contenteditable', 'true')
                            .attr('edit_type', 'button')
                            .addClass('bg-gradient-info')
                            .css('padding','3px')

                      
                            tbl_row.find('.row_data').each(function(index, val) 
                            {  
                            
                              $(this).attr('original_entry', $(this).html());
                            });     
                           

                          });

                            
                          $(document).on('click', '.btn_cancel', function(event) 
                          {
                            event.preventDefault();

                            var tbl_row = $(this).closest('tr');

                            var row_id = tbl_row.attr('row_id');
                            tbl_row.find('.btn_save').hide();
                            tbl_row.find('.btn_cancel').hide();
                            tbl_row.find('.btn_remove').hide();

                            tbl_row.find('.btn_edit').show();

                            tbl_row.find('.row_data')
                            .attr('contenteditable', 'false')
                            .attr('edit_type', 'button')
                            .removeClass('bg-gradient-info')
                            .css('padding','')

                            tbl_row.find('.row_data').each(function(index, val) 
                            {   
                              $(this).html( $(this).attr('original_entry') ); 
                            });  
                          });
                         
                          $(document).on('click', '.btn_remove', function(event) 
                          {
                            event.preventDefault();

                            var tbl_row = $(this).closest('tr');

                            var row_id = tbl_row.attr('row_id');
                            tbl_row.find('.btn_save').hide();
                            tbl_row.find('.btn_cancel').hide();
                            tbl_row.find('.btn_remove').hide();
                            tbl_row.find('.btn_edit').show();

                          
                            tbl_row.find('.row_data')
                            .attr('contenteditable', 'false')
                            .attr('edit_type', 'button')
                            .removeClass('bg-gradient-info')
                            .css('padding','')
                            
                             $(this).closest ('tr').remove();
                             var arr = {}; 
                                 $.extend(arr, {row_id:row_id});
                                 $.ajax({
                                                              type: 'POST',
                                                              data:  arr,
                                                              ContentType: 'application/json',
                                                              url: 'http://localhost:3000/delete',            
                                                                  success: function(data) {

                                                                    console.log(" data to save after edit" + data);

                                                                  }

                                                     });
                                          
                                  });
                          
                                          $(document).on('click', '.btn_save', function(event) 
                                          {
                                            event.preventDefault();
                                            var tbl_row = $(this).closest('tr');

                                            var row_id = tbl_row.attr('row_id');
                                            tbl_row.find('.btn_save').hide();
                                            tbl_row.find('.btn_cancel').hide();
                                            tbl_row.find('.btn_remove').hide();
                                            tbl_row.find('.btn_edit').show();
                                            tbl_row.find('.row_data')
                                            .attr('edit_type', 'click') 
                                            .removeClass('bg-gradient-info')
                                            .css('padding','') 

                                            var arr = {}; 
                                            tbl_row.find('.row_data').each(function(index, val) 
                                            {   
                                              var col_name = $(this).attr('col_name');  
                                              var col_val  =  $(this).html();
                                              if(col_name==="toreturn" && col_val==='yes'){
                                                col_val='1';
                                              }else if (col_name==="toreturn" && col_val==='no'){
                                                col_val='0';
                                              }
                                              arr[col_name] = col_val;

                                            });

                                            $.extend(arr, {row_id:row_id});
                                            console.log(arr);

                                             $.ajax({
                                                              type: 'POST',
                                                              data:  arr,
                                                              ContentType: 'application/json',
                                                              url: 'http://localhost:3000/updateexpense',            
                                                                  success: function(data) {

                                                                    console.log(data);

                                                                  }

                                                     });



                                          });


                           
                        }
                    });
       
      });
        
    })  