const {ipcRenderer} = require('electron');

ipcRenderer.send('request-management-data-simpanan');

ipcRenderer.on('response-management-data-simpanan', function(event, management_data_simpanan){
    
    selectAllData(management_data_simpanan);

    selectData();
});

ipcRenderer.on('response-hapus-management-data-simpanan', function(event){
    alert('Data Simpanan Berhasil dihapus');
    location.reload();
});

function stringToDate(date){
    var d = new Date(date).toISOString().slice(0, 10);
    return d;
}

function selectAllData(management_data_simpanan){
    var html = "";

    management_data_simpanan.forEach(function(result){
        if(result.kode_simpanan == null){

        }else{
            html += '<tr>';
        html += '<td>';
        html += result.kode_simpanan;
        html += '</td>';
        html += '<td>';
        html += result.no_pendaftaran;
        html += '</td>';
        html += '<td>';
        html += result.nama_anggota;
        html += '</td>';
        html += '<td>';
        html += result.nama;
        html += '</td>';
        html += '<td>';
        html += result.saldo_awal;
        html += '</td>';
        html += '<td>';
        html += stringToDate(result.tgl_simpanan);
        html += '</td>';
        html += '<td>';
        html += result.jml_simpanan;
        html += '</td>';
        html += '<td>';
        html += result.saldo_akhir;
        html += '</td>';
        html += '<td>';
        html += '<a href="#" id="'+result.id+'" data-id-anggota="'+result.id_anggota+'">Hapus</a>';
        html += '</td>';
        html += '</tr>';
        }
    });

    $('#my-data').html(html);

    tableSorter();
}

function selectData(){
    var a = $('a');
    for(var i = 0; i < a.length; i++){
        $('#'+a[i].id).click(function(data){
            var id = data.target.id;
            var id_anggota = data.target.attributes.getNamedItem("data-id-anggota").value;

            var data = {
                id_simpanan: id,
                id_anggota: id_anggota,
            }

            ipcRenderer.send('request-hapus-management-data-simpanan', data);

        });
    }
}

function tableSorter(){
    $(function(){  
        $('#table').tablesorter({
            theme: 'default',
			widthFixed: true,
            widgets: ['zebra', 'filter', 'pager'],
            widgetOptions: {
                pager_css: {
					container   : 'tablesorter-pager',    // class added to make included pager.css file work
					errorRow    : 'tablesorter-errorRow', // error information row (don't include period at beginning); styled in theme file
					disabled    : 'disabled'              // class added to arrows @ extremes (i.e. prev/first arrows "disabled" on first page)
                },
                pager_selectors: {
					container   : '.pager',       // target the pager markup (wrapper)
					first       : '.first',       // go to first page arrow
					prev        : '.prev',        // previous page arrow
					next        : '.next',        // next page arrow
					last        : '.last',        // go to last page arrow
					gotoPage    : '.gotoPage',    // go to page selector - select dropdown that sets the current page
					pageDisplay : '.pagedisplay', // location of where the "output" is displayed
					pageSize    : '.pagesize'     // page size selector - select dropdown that sets the "size" option
                },
                pager_output: '{startRow:input} &ndash; {endRow} / {totalRows} rows', // '{page}/{totalPages}'
                pager_updateArrows: true,
                pager_startPage: 0,
                pager_pageReset: 0,
                pager_size: 10,
                pager_countChildRows: false,
                pager_savePages: true,
                pager_storageKey: "tablesorter-pager",
                pager_fixedHeight: true,
                pager_removeRows: false,
                filter_useParsedData: false,
                filter_startsWith: false,
                filter_searchDelay: 300,
                filter_reset: null,
                filter_ignoreCase: true,
                filter_hideFilters: false,
                filter_functions: null,
                filter_cssFilter: "tablesorter-filter",
                filter_columnFilters: true,
                filter_childRows: false
            }
        })
        
        .bind('pagerChange pagerComplete pagerInitialized pageMoved', function(e, c) {
			var p = c.pager, // NEW with the widget... it returns config, instead of config.pager
				msg = '"</span> event triggered, ' + (e.type === 'pagerChange' ? 'going to' : 'now on') +
				' page <span class="typ">' + (p.page + 1) + '/' + p.totalPages + '</span>';
			$('#display')
				.append('<li><span class="str">"' + e.type + msg + '</li>')
				.find('li:first').remove();
        })
        
        $('.goto').click(function() {
			// triggering "pageAndSize" without parameters will reset the
			// pager to page 1 and the original set size (10 by default)
			// $('table').trigger('pageAndSize')
			$table.trigger('pageAndSize', [1, 10]);
        });    
    });
}