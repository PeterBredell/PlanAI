// PDF Utilities for CV generation
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm';
import html2canvas from 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm';

/**
 * Generates a PDF from HTML content and triggers download
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {string} filename - The name of the PDF file to download
 */
export async function generatePDFFromHTML(element, filename) {
    try {
        // Show loading indicator - first check if we're in the modal
        const modalLoadingIndicator = document.getElementById('pdf-loading');
        let customLoadingIndicator = null;

        if (modalLoadingIndicator) {
            // We're in the modal, use the existing loading indicator
            modalLoadingIndicator.classList.remove('hidden');
        } else {
            // Create a custom loading indicator
            customLoadingIndicator = document.createElement('div');
            customLoadingIndicator.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            customLoadingIndicator.innerHTML = `
                <div class="bg-white p-4 rounded-lg shadow-lg text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-2"></div>
                    <p class="text-gray-700">Generating PDF...</p>
                </div>
            `;
            document.body.appendChild(customLoadingIndicator);
        }

        // Create a clone of the element to avoid modifying the original
        const clone = element.cloneNode(true);
        clone.style.width = '800px'; // Set a fixed width for better PDF rendering
        clone.style.padding = '20px';
        clone.style.backgroundColor = 'white';
        clone.style.color = 'black';

        // Temporarily append the clone to the body but make it invisible
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        document.body.appendChild(clone);

        // Use html2canvas to capture the element
        const canvas = await html2canvas(clone, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        // Remove the clone from the DOM
        document.body.removeChild(clone);

        // Create PDF with A4 dimensions
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Calculate dimensions to fit the content properly
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add the image to the PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // If the content is longer than one page, add more pages
        let heightLeft = imgHeight;
        let position = 0;

        while (heightLeft > pageHeight) {
            position = heightLeft - pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Save the PDF
        pdf.save(filename);

        // Remove or hide loading indicator
        if (modalLoadingIndicator) {
            modalLoadingIndicator.classList.add('hidden');
        } else if (customLoadingIndicator) {
            document.body.removeChild(customLoadingIndicator);
        }

        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);

        // Remove or hide loading indicator in case of error
        const modalLoadingIndicator = document.getElementById('pdf-loading');
        if (modalLoadingIndicator) {
            modalLoadingIndicator.classList.add('hidden');
        }

        // Remove any custom loading indicator that might have been created
        const customLoadingIndicator = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50.flex.items-center.justify-center.z-50');
        if (customLoadingIndicator) {
            document.body.removeChild(customLoadingIndicator);
        }

        alert('There was an error generating your PDF. Please try again.');
        return false;
    }
}
