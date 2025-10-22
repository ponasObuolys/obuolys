import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  storeLocalImage,
  getLocalImage,
  removeLocalImage,
  clearLocalImages,
  getAllImageKeys,
  fileToDataUrl,
  isValidImage,
  getImageDimensions,
} from "../file-upload";

describe("File Upload Utilities", () => {
  beforeEach(() => {
    clearLocalImages();
  });

  afterEach(() => {
    clearLocalImages();
  });

  describe("Local Image Storage", () => {
    it("stores and retrieves images correctly", () => {
      const key = "test-image-1";
      const dataUrl =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      storeLocalImage(key, dataUrl);
      const retrieved = getLocalImage(key);

      expect(retrieved).toBe(dataUrl);
    });

    it("returns null for non-existent images", () => {
      const result = getLocalImage("non-existent-key");
      expect(result).toBeNull();
    });

    it("removes images correctly", () => {
      const key = "test-image-to-remove";
      const dataUrl = "data:image/png;base64,test";

      storeLocalImage(key, dataUrl);
      expect(getLocalImage(key)).toBe(dataUrl);

      removeLocalImage(key);
      expect(getLocalImage(key)).toBeNull();
    });

    it("clears all images", () => {
      storeLocalImage("image1", "data:image/png;base64,test1");
      storeLocalImage("image2", "data:image/png;base64,test2");
      storeLocalImage("image3", "data:image/png;base64,test3");

      expect(getAllImageKeys()).toHaveLength(3);

      clearLocalImages();

      expect(getAllImageKeys()).toHaveLength(0);
      expect(getLocalImage("image1")).toBeNull();
      expect(getLocalImage("image2")).toBeNull();
      expect(getLocalImage("image3")).toBeNull();
    });

    it("gets all image keys correctly", () => {
      const keys = ["img1", "img2", "img3"];

      keys.forEach(key => {
        storeLocalImage(key, `data:image/png;base64,${key}`);
      });

      const retrievedKeys = getAllImageKeys();
      expect(retrievedKeys).toHaveLength(3);
      keys.forEach(key => {
        expect(retrievedKeys).toContain(key);
      });
    });

    it("overwrites existing images with same key", () => {
      const key = "overwrite-test";
      const dataUrl1 = "data:image/png;base64,first";
      const dataUrl2 = "data:image/png;base64,second";

      storeLocalImage(key, dataUrl1);
      expect(getLocalImage(key)).toBe(dataUrl1);

      storeLocalImage(key, dataUrl2);
      expect(getLocalImage(key)).toBe(dataUrl2);
      expect(getAllImageKeys()).toHaveLength(1);
    });
  });

  describe("File Processing", () => {
    it("converts file to data URL", async () => {
      const mockFileContent = "test file content";
      const expectedDataUrl = `data:text/plain;base64,${btoa(mockFileContent)}`;

      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        result: expectedDataUrl,
        onload: null as any,
        onerror: null as any,
      };

      vi.stubGlobal(
        "FileReader",
        vi.fn(() => mockFileReader)
      );

      const file = new File([mockFileContent], "test.txt", { type: "text/plain" });

      const promise = fileToDataUrl(file);

      // Simulate successful read
      mockFileReader.onload();

      const result = await promise;
      expect(result).toBe(expectedDataUrl);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);
    });

    it("handles file read errors", async () => {
      const mockError = new Error("File read failed");

      const mockFileReader = {
        readAsDataURL: vi.fn(),
        result: null,
        onload: null as any,
        onerror: null as any,
      };

      vi.stubGlobal(
        "FileReader",
        vi.fn(() => mockFileReader)
      );

      const file = new File(["test"], "test.txt", { type: "text/plain" });

      const promise = fileToDataUrl(file);

      // Simulate error
      mockFileReader.onerror(mockError);

      await expect(promise).rejects.toThrow("File read failed");
    });

    it("validates image file types correctly", () => {
      const validImageFiles = [
        new File([""], "test.jpg", { type: "image/jpeg" }),
        new File([""], "test.jpeg", { type: "image/jpg" }),
        new File([""], "test.png", { type: "image/png" }),
        new File([""], "test.gif", { type: "image/gif" }),
        new File([""], "test.webp", { type: "image/webp" }),
      ];

      validImageFiles.forEach(file => {
        expect(isValidImage(file)).toBe(true);
      });

      const invalidFiles = [
        new File([""], "test.txt", { type: "text/plain" }),
        new File([""], "test.pdf", { type: "application/pdf" }),
        new File([""], "test.doc", { type: "application/msword" }),
        new File([""], "test.mp4", { type: "video/mp4" }),
      ];

      invalidFiles.forEach(file => {
        expect(isValidImage(file)).toBe(false);
      });
    });

    it("gets image dimensions correctly", async () => {
      const mockImage = {
        naturalWidth: 800,
        naturalHeight: 600,
        onload: null as any,
        onerror: null as any,
        src: "",
      };

      const mockCreateObjectURL = vi.fn(() => "blob:mock-url");
      vi.stubGlobal("URL", { createObjectURL: mockCreateObjectURL });
      vi.stubGlobal(
        "Image",
        vi.fn(() => mockImage)
      );

      const file = new File([""], "test.jpg", { type: "image/jpeg" });

      const promise = getImageDimensions(file);

      // Simulate successful image load
      mockImage.onload();

      const dimensions = await promise;

      expect(dimensions).toEqual({ width: 800, height: 600 });
      expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    });

    it("handles image dimension errors", async () => {
      const mockError = new Error("Image load failed");

      const mockImage = {
        naturalWidth: 0,
        naturalHeight: 0,
        onload: null as any,
        onerror: null as any,
        src: "",
      };

      const mockCreateObjectURL = vi.fn(() => "blob:mock-url");
      vi.stubGlobal("URL", { createObjectURL: mockCreateObjectURL });
      vi.stubGlobal(
        "Image",
        vi.fn(() => mockImage)
      );

      const file = new File([""], "test.jpg", { type: "image/jpeg" });

      const promise = getImageDimensions(file);

      // Simulate error
      mockImage.onerror(mockError);

      await expect(promise).rejects.toThrow("Image load failed");
    });

    it("handles corrupted image files gracefully", async () => {
      const mockImage = {
        naturalWidth: 0,
        naturalHeight: 0,
        onload: null as any,
        onerror: null as any,
        src: "",
      };

      vi.stubGlobal("URL", { createObjectURL: vi.fn(() => "blob:mock-url") });
      vi.stubGlobal(
        "Image",
        vi.fn(() => mockImage)
      );

      const corruptedFile = new File(["corrupted data"], "corrupted.jpg", { type: "image/jpeg" });

      const promise = getImageDimensions(corruptedFile);

      // Simulate corrupted image (onload with 0 dimensions)
      mockImage.onload();

      const dimensions = await promise;
      expect(dimensions).toEqual({ width: 0, height: 0 });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty file names", () => {
      const file = new File([""], "", { type: "image/png" });
      expect(isValidImage(file)).toBe(true);
    });

    it("handles files with no extension", () => {
      const file = new File([""], "imagefile", { type: "image/png" });
      expect(isValidImage(file)).toBe(true);
    });

    it("handles very large keys in storage", () => {
      const longKey = "a".repeat(1000);
      const dataUrl = "data:image/png;base64,test";

      storeLocalImage(longKey, dataUrl);
      expect(getLocalImage(longKey)).toBe(dataUrl);
    });

    it("handles special characters in keys", () => {
      const specialKey = "test_image-123.png?v=1&type=thumbnail";
      const dataUrl = "data:image/png;base64,test";

      storeLocalImage(specialKey, dataUrl);
      expect(getLocalImage(specialKey)).toBe(dataUrl);
    });

    it("handles unicode characters in file names", () => {
      const file = new File([""], "paveikslėlis.png", { type: "image/png" });
      expect(isValidImage(file)).toBe(true);
    });

    it("maintains storage consistency across operations", () => {
      // Add multiple images
      for (let i = 0; i < 10; i++) {
        storeLocalImage(`image_${i}`, `data:image/png;base64,image${i}`);
      }

      expect(getAllImageKeys()).toHaveLength(10);

      // Remove some images
      removeLocalImage("image_3");
      removeLocalImage("image_7");

      expect(getAllImageKeys()).toHaveLength(8);
      expect(getLocalImage("image_3")).toBeNull();
      expect(getLocalImage("image_7")).toBeNull();
      expect(getLocalImage("image_5")).toBe("data:image/png;base64,image5");

      // Add more images
      storeLocalImage("new_image_1", "data:image/png;base64,new1");
      storeLocalImage("new_image_2", "data:image/png;base64,new2");

      expect(getAllImageKeys()).toHaveLength(10);
    });
  });
});
