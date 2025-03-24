// Variables para manejar extras
let extrasCount = 0;
const extras = [];

// Funciones para cambiar de página
function showPage(pageId) {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('presupuesto-page').classList.add('hidden');
    document.getElementById('recibo-page').classList.add('hidden');
    
    document.getElementById(pageId).classList.remove('hidden');
}

// Establecer la fecha actual en los campos fecha
function setFechaActual() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    document.getElementById('presupuesto-fecha').value = formattedDate;
    document.getElementById('recibo-fecha').value = formattedDate;
}

// Agregar un extra
function agregarExtra() {
    extrasCount++;
    const extraId = `extra-${extrasCount}`;
    
    const extraDiv = document.createElement('div');
    extraDiv.className = 'extra-item';
    extraDiv.id = extraId;
    extraDiv.innerHTML = `
        <div class="form-group">
            <label for="${extraId}-desc">Descripción:</label>
            <input type="text" id="${extraId}-desc" placeholder="Descripción del extra" class="extra-descripcion">
        </div>
        <div class="form-group">
            <label for="${extraId}-importe">Importe:</label>
            <div class="amount-input">
                <input type="number" id="${extraId}-importe" placeholder="0" min="0" class="extra-importe" oninput="calcularTotalPresupuesto()">
            </div>
        </div>
        <div class="extra-controls">
            <button type="button" class="btn-remove-extra" onclick="eliminarExtra('${extraId}')">×</button>
        </div>
    `;
    
    document.getElementById('extras-container').appendChild(extraDiv);
    extras.push(extraId);
}

// Eliminar un extra
function eliminarExtra(extraId) {
    const extraElement = document.getElementById(extraId);
    if (extraElement) {
        extraElement.remove();
        
        // Eliminar del array
        const index = extras.indexOf(extraId);
        if (index > -1) {
            extras.splice(index, 1);
        }
        
        calcularTotalPresupuesto();
    }
}

// Calcular el total del presupuesto
function calcularTotalPresupuesto() {
    const importe = parseFloat(document.getElementById('presupuesto-importe').value) || 0;
    
    // Sumar todos los extras
    let totalExtras = 0;
    extras.forEach(extraId => {
        const extraImporte = document.getElementById(`${extraId}-importe`);
        if (extraImporte) {
            totalExtras += parseFloat(extraImporte.value) || 0;
        }
    });
    
    const total = importe + totalExtras;
    
    document.getElementById('presupuesto-total').textContent = `$${total.toLocaleString()}`;
}

// Formatear un número como moneda
function formatCurrency(value) {
    const number = parseFloat(value) || 0;
    return `$${number.toLocaleString()}`;
}

// Generar PDF de Presupuesto
function generarPDFPresupuesto() {
    // Obtener los valores del formulario
    const fecha = document.getElementById('presupuesto-fecha').value;
    const salon = document.getElementById('presupuesto-salon').value;
    const evento = document.getElementById('presupuesto-evento').value;
    const cliente = document.getElementById('presupuesto-cliente').value;
    const detalles = document.getElementById('presupuesto-detalles').value;
    const importe = document.getElementById('presupuesto-importe').value;
    
    // Obtener fecha del evento
    const fechaEvento = document.getElementById('presupuesto-fecha-evento').value;

    // Actualizar contenido del PDF
    document.getElementById('pdf-presupuesto-fecha').textContent = formatDate(fecha);
    document.getElementById('pdf-presupuesto-fecha-evento').textContent = formatDate(fechaEvento);
    document.getElementById('pdf-presupuesto-salon').textContent = salon;
    document.getElementById('pdf-presupuesto-evento').textContent = evento;
    document.getElementById('pdf-presupuesto-cliente').textContent = cliente;
    document.getElementById('pdf-presupuesto-detalles').textContent = detalles;
    document.getElementById('pdf-presupuesto-importe').textContent = formatCurrency(importe);
    
    // Limpiar el contenedor de extras
    const pdfExtrasContainer = document.getElementById('pdf-extras-container');
    pdfExtrasContainer.innerHTML = '';
    
    // Agregar los extras al PDF
    let totalExtras = 0;
    extras.forEach(extraId => {
        const extraDesc = document.getElementById(`${extraId}-desc`).value;
        const extraImporte = parseFloat(document.getElementById(`${extraId}-importe`).value) || 0;
        
        if (extraDesc || extraImporte > 0) {
            const extraDiv = document.createElement('div');
            extraDiv.className = 'pdf-extra-row';
            extraDiv.innerHTML = `
                <div class="pdf-extra-name">${extraDesc}</div>
                <div class="pdf-extra-amount">${formatCurrency(extraImporte)}</div>
            `;
            pdfExtrasContainer.appendChild(extraDiv);
            
            totalExtras += extraImporte;
        }
    });
    
    const total = (parseFloat(importe) || 0) + totalExtras;
    document.getElementById('pdf-presupuesto-total').textContent = formatCurrency(total);
    
    // Generar PDF
    const filename = `Presupuesto_${formatDateFile(fecha)}`;
    generatePDF('pdf-presupuesto', filename);}

// Generar PDF de Recibo
function generarPDFRecibo() {
    // Obtener los valores del formulario
    const fecha = document.getElementById('recibo-fecha').value;
    const salon = document.getElementById('recibo-salon').value;
    const evento = document.getElementById('recibo-evento').value;
    const cliente = document.getElementById('recibo-cliente').value;
    const detalle = document.getElementById('recibo-detalle').value;
    const importe = document.getElementById('recibo-importe').value;
    
    // Obtener fecha del evento
    const fechaEvento = document.getElementById('recibo-fecha-evento').value;

    // Actualizar contenido del PDF
    document.getElementById('pdf-recibo-fecha').textContent = formatDate(fecha);
    document.getElementById('pdf-recibo-fecha-evento').textContent = formatDate(fechaEvento);
    document.getElementById('pdf-recibo-salon').textContent = salon;
    document.getElementById('pdf-recibo-evento').textContent = evento;
    document.getElementById('pdf-recibo-cliente').textContent = cliente;
    document.getElementById('pdf-recibo-detalle').textContent = detalle;
    document.getElementById('pdf-recibo-importe').textContent = formatCurrency(importe);
    
    // Generar PDF
    const filename = `Recibo_${formatDateFile(fecha)}`;
    generatePDF('pdf-recibo', filename);}


// Función para generar PDF usando html2canvas y jsPDF
// Función optimizada para generar PDF
// Función optimizada para generar PDF
// Función optimizada para generar PDF
function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Obtener el nombre del cliente
    const clienteInput = document.getElementById('cliente');
    const nombreCliente = clienteInput ? clienteInput.value : 'Cliente';
    
    // Configuración de fuentes y colores
    doc.setFillColor(52, 152, 219);
    doc.rect(0, 0, 210, 40, 'F');

    // Eliminar logo temporal o base64
    // const logoBase64 = 'data:image/png;base64,'; 
    // doc.addImage(logoBase64, 'PNG', 150, 5, 30, 30);
    
    // Encabezado
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20); // Reducir tamaño de fuente
    doc.text('CARLOS HOMOLA', 20, 20);
    doc.setFontSize(12); // Reducir tamaño de fuente
    doc.setFont("helvetica", "normal");
    doc.text('Servicios Integrales', 20, 30);

    // Información del presupuesto
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(12); // Reducir tamaño de fuente
    doc.text('PRESUPUESTO', 20, 50);
    
    // Línea divisoria
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);
    
    // Datos del cliente con fecha formateada
    doc.setFontSize(10); // Reducir tamaño de fuente
    const fechaFormateada = formatearFecha(document.getElementById('fecha').value);
    doc.text(`Fecha: ${fechaFormateada}`, 20, 65);
    doc.text(`Cliente: ${nombreCliente}`, 20, 75);

    // Tabla de items
    let y = 90;
    doc.setFillColor(241, 196, 15);
    doc.rect(20, y - 10, 170, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('DESCRIPCIÓN', 25, y - 2);
    doc.text('IMPORTE', 150, y - 2);
    
    const items = document.querySelectorAll('.item-row');
    items.forEach((item, index) => {
        const trabajo = item.querySelector('.trabajo').value;
        const importe = Number(item.querySelector('.importe').value);
        
        if (trabajo && importe) {
            const maxWidth = 90;
            doc.setFontSize(10); // Reducir tamaño de fuente
            
            let lines = doc.splitTextToSize(trabajo, maxWidth);
            
            const lineHeight = 6;
            const textHeight = lines.length * lineHeight;
            const rowHeight = Math.max(10, textHeight);
            
            if (index % 2 === 0) {
                doc.setFillColor(245, 245, 245);
                doc.rect(20, y, 170, rowHeight, 'F');
            }
            
            doc.text(lines, 25, y + 7);
            doc.text(`$ ${formatearNumero(importe)}`, 150, y + (rowHeight/2));
            
            y += rowHeight;
        }
    });    
        
    // Total
    doc.setFillColor(52, 152, 219);
    doc.rect(20, y + 5, 170, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    const totalText = document.getElementById('total').textContent;
    doc.text(`TOTAL: ${totalText}`, 25, y + 13);
    
    // Pie de página
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    doc.text('Carlos Homola', 20, y + 30);
    doc.text('San Rafael / Cel: 2604-08-5532', 20, y + 35);
    
    // Generar y compartir PDF
    const pdfOutput = doc.output('blob');
    const pdfFile = new File([pdfOutput], `Presupuesto ${nombreCliente}.pdf`, { type: 'application/pdf' });
    
    // Función para compartir o descargar
    function compartirODescargar() {
        // Método principal: Web Share API
        if (navigator.share) {
            navigator.share({
                files: [pdfFile],
                title: `Presupuesto ${nombreCliente}`
            }).catch(err => {
                console.error('Error al compartir:', err);
                descargarPDF();
            });
        } 
        // Método alternativo: crear enlace de descarga
        else {
            descargarPDF();
        }
    }
    
    // Función de descarga
    function descargarPDF() {
        const url = URL.createObjectURL(pdfFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Presupuesto ${nombreCliente}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    // Intentar compartir o descargar
    try {
        // Verificar si es un dispositivo móvil
        const esMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (esMobile) {
            compartirODescargar();
        } else {
            descargarPDF();
        }
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        alert('Hubo un error al generar el PDF. Por favor, intente nuevamente.');
    }
}
// Función mejorada para compartir en dispositivos móviles
function sharePDFOnMobile(pdfBlob, filename) {
    // Crear URL del archivo
    const fileURL = URL.createObjectURL(pdfBlob);
    
    // Método 1: Usar Web Share API si está disponible
    if (navigator.share) {
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });
        
        navigator.share({
            files: [file],
            title: filename
        }).catch(console.error);
    } 
    // Método 2: Abrir directamente para descargar/compartir
    else {
        const downloadLink = document.createElement('a');
        downloadLink.href = fileURL;
        downloadLink.download = filename;
        
        // Añadir al body y simular clic
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Limpiar
        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(fileURL);
        }, 100);
    }
}

// Función para detectar dispositivos móviles (mejorada)
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Función auxiliar para descarga de PDF
function fallbackDownload(pdfBlob, filename) {
    const fileURL = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = fileURL;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // Limpiar después de un breve tiempo
    setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(fileURL);
    }, 100);
}

// Función auxiliar para detectar si es móvil
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


// Detectar si es dispositivo móvil
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Formatear fecha
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR');
}

// Formatear fecha para nombre de archivo
function formatDateFile(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

// Inicializar al cargar la página
window.onload = function() {
    setFechaActual();
    // Agregar un extra por defecto
    agregarExtra();
};
// Enviar por WhatsApp con mensaje dinámico
function enviarPorWhatsApp(tipo, salon, fecha) {
    const tipoTexto = tipo === 'presupuesto' ? 'Presupuesto' : 'Recibo';
    const mensaje = `${tipoTexto} para el salón ${salon} con fecha ${formatDate(fecha)}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}
