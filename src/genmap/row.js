
// Hàm lấy ngẫu nhiên k phần tử từ mảng
function getRandomElementsFromArray(arr, k) {
    var result = [];
    // Lặp k lần để lấy ngẫu nhiên k phần tử
    for (let i = 0; i < k; i++) {
      // Tạo chỉ số ngẫu nhiên từ 0 đến số phần tử còn lại trong mảng
      const randomIndex = Math.floor(Math.random() * arr.length);
      // Lấy phần tử tại chỉ số ngẫu nhiên và đẩy vào mảng kết quả
      result.push(arr[randomIndex]);
      arr.splice(randomIndex, 1);
    }
    return result;
  }
export class Row {
    constructor(count){
        this.count = count;
        this.data = [0,0,0,0,0,0,0];
        this.idx= [0,1,2,3,4,5,6];
        this.createNewRow();
    }
    createNewRow(){
        
        if(this.count>1){ // ring và bonus không xuất hiện ở hàng đầu tiên, chỉ xuất hiện từ hàng thứ 2 trở đi
            var idxB= getRandomElementsFromArray(this.idx,1)[0]; // hàng nào cũng phải có 1 item preball, xác định vị trí của item này
            this.data[idxB]=-1; //preBall
            var random1 = Math.random(); // Xác suất xuất hiện của coin (50%)
            if(random1<0.5){
                var idxR=getRandomElementsFromArray(this.idx,1)[0];
                this.data[idxR]=-2; //coin
            }
        }
        var random2= Math.random();
        var idxX=[]; // mảng lưu các chỉ số của các ô lớn
        if(random2 <=0.75){
            idxX=getRandomElementsFromArray(this.idx,1);  //xác suất xuất hiện 1 ô lớn là 75%
        }
         if(random2<=0.87 && random2 >0.75){
             idxX=getRandomElementsFromArray(this.idx,2);// xác suất xuất hiện 2 ô lớn là 12%
        }
        if(random2<=0.9 && random2 >0.87){
            idxX=getRandomElementsFromArray(this.idx,3);// xác suất xuất hiện 3 ô lớn là 3%
        }
        for(let i=0;i< idxX.length;i++){
            this.data[idxX[i]]=this.count*2; // ô đặc biệt có điểm gấp đôi ô bình thường
        }
        var idxNull=getRandomElementsFromArray(this.idx,1)[0];
        this.data[idxNull]=0; // chắc chắn có ít nhất 1 ô null
        var idxS=getRandomElementsFromArray(this.idx,1)[0];
        this.data[idxS]=this.count; // chắc chắn có ít nhất 1 ô điểm bình thường
        for(let i=0;i<this.idx.length;i++){ // xác suất xuất hiện ô null và ô điểm bình thường là 50 50
            var tmp = Math.random();
            if(tmp >=0.5){
                this.data[this.idx[i]]=0;
            }
            else{
                this.data[this.idx[i]]=this.count;
            }
        }
    }
}
