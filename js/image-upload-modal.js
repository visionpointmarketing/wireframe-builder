import { state } from './state.js';
import { generateImageKey, setImage, getImage, removeImage } from './image-store.js';

export class ImageUploadModal {
    constructor(updateCanvasFn) {
        this.updateCanvas = updateCanvasFn;
        this.modal = document.getElementById('imageUploadBackdrop');
        this.preview = document.getElementById('imagePreview');
        this.previewImg = document.getElementById('imagePreviewImg');
        this.previewEmpty = document.getElementById('imagePreviewEmpty');
        this.fileInput = document.getElementById('imageFileInput');
        this.urlInput = document.getElementById('imageUrlInput');
        this.removeBtn = document.getElementById('imageRemoveBtn');
        this.saveBtn = document.getElementById('imageSaveBtn');
        this.cancelBtn = document.getElementById('imageCancelBtn');
        this.closeBtn = document.getElementById('closeImageUpload');
        this.loadUrlBtn = document.getElementById('imageLoadUrlBtn');

        this.sectionIndex = null;
        this.imageSlot = null;
        this.pendingData = null;

        this.init();
    }

    init() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.cancelBtn.addEventListener('click', () => this.close());
        this.saveBtn.addEventListener('click', () => this.save());
        this.removeBtn.addEventListener('click', () => this.remove());

        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) this.handleFileSelect(e.target.files[0]);
        });

        this.loadUrlBtn.addEventListener('click', () => {
            const url = this.urlInput.value.trim();
            if (url) this.handleUrlInput(url);
        });

        this.urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const url = this.urlInput.value.trim();
                if (url) this.handleUrlInput(url);
            }
        });

        // Drag and drop on preview area
        this.preview.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.preview.classList.add('drag-over');
        });
        this.preview.addEventListener('dragleave', () => {
            this.preview.classList.remove('drag-over');
        });
        this.preview.addEventListener('drop', (e) => {
            e.preventDefault();
            this.preview.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleFileSelect(file);
            }
        });

        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    open(sectionIndex, imageSlot) {
        this.sectionIndex = sectionIndex;
        this.imageSlot = imageSlot;
        this.pendingData = null;
        this.fileInput.value = '';
        this.urlInput.value = '';

        // Check for existing image
        const section = state.sections[sectionIndex];
        const images = section && section.content && section.content.images;
        const existingKey = images && images[imageSlot];

        if (existingKey) {
            const data = getImage(existingKey);
            if (data) {
                this.pendingData = data;
                this.showPreview(data);
                this.removeBtn.style.display = '';
            } else {
                this.clearPreview();
                this.removeBtn.style.display = 'none';
            }
        } else {
            this.clearPreview();
            this.removeBtn.style.display = 'none';
        }

        this.modal.style.display = 'flex';
    }

    close() {
        this.modal.style.display = 'none';
        this.pendingData = null;
        this.sectionIndex = null;
        this.imageSlot = null;
    }

    save() {
        if (this.sectionIndex === null) return;
        const section = state.sections[this.sectionIndex];
        if (!section) return;

        if (!section.content.images) section.content.images = {};

        if (this.pendingData) {
            // Remove old image if different
            const oldKey = section.content.images[this.imageSlot];
            if (oldKey) removeImage(oldKey);

            const key = generateImageKey();
            setImage(key, this.pendingData);
            section.content.images[this.imageSlot] = key;
        }

        this.updateCanvas();
        this.close();
    }

    remove() {
        if (this.sectionIndex === null) return;
        const section = state.sections[this.sectionIndex];
        if (!section) return;

        const images = section.content && section.content.images;
        if (images && images[this.imageSlot]) {
            removeImage(images[this.imageSlot]);
            delete images[this.imageSlot];
        }

        this.updateCanvas();
        this.close();
    }

    handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be under 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.pendingData = e.target.result;
            this.showPreview(this.pendingData);
        };
        reader.readAsDataURL(file);
    }

    handleUrlInput(url) {
        this.pendingData = url;
        this.showPreview(url);
    }

    showPreview(src) {
        this.previewImg.src = src;
        this.previewImg.style.display = 'block';
        this.previewEmpty.style.display = 'none';
    }

    clearPreview() {
        this.previewImg.src = '';
        this.previewImg.style.display = 'none';
        this.previewEmpty.style.display = '';
    }
}
