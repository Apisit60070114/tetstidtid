class Scanner {
  constructor(target) { 
    this.target = target
    this.data = {
      codeInternal: 0,
      codeListener: function (val) {},
      set code(val) {
        this.codeInternal = val;
        this.codeListener(val);
      },
      get code() {
        return this.codeInternal;
      },
      registerListener: function (listener) {
        this.codeListener = listener;
      }
    }
  }

  //  -------
  init() {
    let self = this


    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector(self.target)
      },
      decoder: {
        readers: ["code_39_reader"]
      }
    }, function (err) {
      if (err) {
        console.log(err);
        return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
    });

    // กรอบเขียวตอน detect
    Quagga.onProcessed(function (result) {
      let drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
          result.boxes.filter(function (box) {
            return box !== result.box;
          }).forEach(function (box) {
            Quagga.ImageDebug.drawPath(box, {
              x: 0,
              y: 1
            }, drawingCtx, {
              color: "green",
              lineWidth: 2
            });
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, {
            x: 0,
            y: 1
          }, drawingCtx, {
            color: "#00F",
            lineWidth: 2
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, {
            x: 'x',
            y: 'y'
          }, drawingCtx, {
            color: 'red',
            lineWidth: 3
          });
        }
      }
    });

    // ---------

    Quagga.onDetected(function (result) {
      //code คือตัวรหัสนศที่จะได้
      let code = result.codeResult.code;

      self.setCode(code)

      // console.log(code)
    });
  }

  // --------

  setCode(code) {
    if (code != this.data.code && isFinite(code)) {
      this.data.code = code
    }
  }

  getCode() {
    if (this.data.code) {
      return this.data.code
    }
    return false
  }

  // เอาไว้เช็คว่ารหัสนศเปลี่ยนรึยัง
  onDetected(callback) {
    
    this.data.registerListener(function () {
      // พอค่าเปลี่ยนจะมาทำตรงนี้
      callback()
    })
  }
}