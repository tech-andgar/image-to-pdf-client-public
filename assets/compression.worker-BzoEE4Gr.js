(function() {
	async function t(t, e) {
		const i = await createImageBitmap(t);
		if (i.width * i.height > e.maxImagePixels) throw i.close(), /* @__PURE__ */ new Error(`Imagen demasiado grande (${i.width}x${i.height}). Máximo ~100 megapíxeles.`);
		const { width: a, height: o } = function(t, e, i) {
			let a = t, o = e;
			if (i.maxWidth && a > i.maxWidth) {
				const t = i.maxWidth / a;
				a = i.maxWidth, i.maintainAspectRatio && (o *= t);
			}
			if (i.maxHeight && o > i.maxHeight) {
				const t = i.maxHeight / o;
				o = i.maxHeight, i.maintainAspectRatio && (a *= t);
			}
			return {
				width: Math.round(a),
				height: Math.round(o)
			};
		}(i.width, i.height, e), h = new OffscreenCanvas(a, o), n = h.getContext("2d");
		if (!n) throw new Error("No OffscreenCanvas context");
		return n.fillStyle = "#ffffff", n.fillRect(0, 0, a, o), n.drawImage(i, 0, 0, a, o), i.close(), {
			blob: await h.convertToBlob({
				type: "image/jpeg",
				quality: e.quality
			}),
			width: a,
			height: o
		};
	}
	globalThis.onmessage = async (e) => {
		const { id: i, file: a, options: o } = e.data;
		try {
			const { blob: e, width: h, height: n } = await t(a, o), s = {
				id: i,
				blob: e,
				width: h,
				height: n
			};
			globalThis.postMessage(s);
		} catch (h) {
			const t = {
				id: i,
				error: h instanceof Error ? h.message : "Compression failed"
			};
			globalThis.postMessage(t);
		}
	};
})();
