// 1. Render songs
// 2.  Scroll top
// 3. Play/pause/seek
// 4. CD rotate
// 5. Next/Prev
// 6. Random
// 7. Next/ Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBTN = $('.btn-prev')
const nextBTN = $('.btn-next')
const randomBTN = $('.btn-random')
const repeatBTN = $('.btn-repeat')
const playlist = $('.playlist')



const app = {
    currentIndex:0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
   songs: [
    {
        name:'Parachute',
        singer: 'PARYS (feat. Ivy)',
        path:'./music/song1.mp3',
        image:'./img/song1.jpg'
 },
 {
    name:'Dân chơi sao phải khóc',
    singer: 'Andree Right Hand, Rhyder, WOKEUP',
    path:'./music/song2.mp3',
    image:'./img/song2.jpg'
},
{
    name:'id 2022',
    singer: 'W/n, 267',
    path:'./music/song3.mp3',
    image:'./img/song3.jpg'
},
{
    name:'Apologize',
    singer: 'Timbaland, OneRepublic',
    path:'./music/song4.mp3',
    image:'./img/song4.jpg'
},
{
    name:'Hai đứa nhóc',
    singer: 'Ronboogz',
    path:'./music/song5.mp3',
    image:'./img/song5.jpg'
},
{
    name:'Love Is Gone',
    singer: ' SLANDER ft. Dylan Matthew',
    path:'./music/song6.mp3',
    image:'./img/song6.jpg'
},
{
    name:'Khóa ly biệt',
    singer: 'Voi bản đôn',
    path:'./music/song7.mp3',
    image:'./img/song7.jpg'
},
{
    name:'Buồn hay vui',
    singer: 'RPT MCK, Obito, Ronboogz & Boyzed',
    path:'./music/song8.mp3',
    image:'./img/song8.jpg'
},
{
    name:'Western Feel',
    singer: 'Bartel Union',
    path:'./music/song9.mp3',
    image:'./img/song9.jpg'
},
{
    name:'dự báo thời tiết hôm nay mưa',
    singer: 'GREY D',
    path:'./music/song10.mp3',
    image:'./img/song10.jpg'
},
{
    name:'Under The Influence',
    singer: 'Chris Brown',
    path:'./music/song11.mp3',
    image:'./img/song11.jpg'
}
],
setConfig:function(key,value){
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
},
render:function(){
    const htmls = this.songs.map((song, index)=>{
        return `
            <div class="song ${index === this.currentIndex ? 'active':''}" data-index=${index}>
                <div class="thumb" style="background-image:url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                 </div>
                 <div class="option">
                     <i class="fas fa-ellipsis-h"></i>
                 </div>
            </div>
            `
    })
     playlist.innerHTML = htmls.join('')
},
defineProperties:function(){
    Object.defineProperty(this,'currentSong',{
        get:function(){
            return this.songs[this.currentIndex]
        }
    })
    
},
handleEvents:function(){
    const _this = this
    const cdWidth = cd.offsetWidth

    //Xử lý CD quay và dừng
   const cdThumbAnimate= cdThumb.animate([
        { transform:'rotate(360deg)' }
    ],{
        duration:10000, //10 giây
        iterations: Infinity
    })
    cdThumbAnimate.pause()

    //xử lý phóng to thu nhỏ CD
    document.onscroll = function(){
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const  newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth >0 ? newCdWidth + 'px' :0
        cd.style.opacity = newCdWidth / cdWidth
    }
    //xử lý khi click play
    playBtn.onclick = function(){
        if(_this.isPlaying){
            audio.pause()       
        }else{          
           audio.play()           
        }
        _this.scrollToActionSong()
    }
    //Khi song được play 
    audio.onplay= function(){
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
    }

     //Khi song bị pause 
     audio.onpause= function(){
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
    }
    
    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function(){
        if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
            progress.value = progressPercent 
            progress.style.width = audio.duration.offsetWidth + '%'
          
          
        }
    }
    //Xử lý khi tua
    progress.onchange = function(e){
        const seekTime = audio.duration / 100 * e.target.value
        audio.currentTime = seekTime
        
    }
    //Khi next bài hát 
    nextBTN.onclick = function(){
        if(_this.isRandom){
            _this.playRandomSong()
        }else{
            _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActionSong()
    }
    //Khi prev bài hát
    prevBTN.onclick = function(){
        if(_this.isRandom){
            _this.playRandomSong()
        }else{
       
            _this.prevSong()
        }      
        audio.play()
        _this.render()
        _this.scrollToActionSong()
    }
    //Khi random bật tắt
    randomBTN.onclick = function(e){
        _this.isRandom = !_this.isRandom     
        _this.setConfig('isRandom',_this.isRandom)
        randomBTN.classList.toggle('active',_this.isRandom)
    }

    //Xử lý phát lại bài hát
    repeatBTN.onclick= function(){
        _this.isRepeat = !_this.isRepeat
        _this.setConfig('isRepeat',_this.isRepeat)
        repeatBTN.classList.toggle('active',_this.isRepeat)
    }
    //Xử lý next song khi audio ended
    audio.onended = function(){
        if(_this.isRepeat){
            audio.play()
        }else{
            nextBTN.onclick();
        }
    }
  
    //Thiết lập thời gian tự động tắt
 
   
    //Lăng nghe hành vi click vào playlist
    playlist.onclick= function(e){
        const songNode = e.target.closest('.song:not(.active)')
        if(songNode || e.target.closest('.option')){
            // Xử lý khi click vào song
                if(songNode){
                   _this.currentIndex = Number(songNode.dataset.index)
                   _this.loadtCurrentSong()
                   audio.play()
                   _this.render()
                }
                //Xử lý khi click vào option
                if(e.target.closest('.option')){

                }
        }
    }
},
scrollToActionSong:function(){
    setTimeout(()=>{
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block:'end'
        })
    },300)

},

timeLine:function(){

},
loadtCurrentSong:function(){
heading.textContent = this.currentSong.name
cdThumb.style.backgroundImage =` url('${this.currentSong.image}')`
audio.src = this.currentSong.path 
},

loadConfig:function(){
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
    // Object.assign(this, this.config)
},
nextSong:function(){
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0
    }
    this.loadtCurrentSong()
},
prevSong:function(){
    this.currentIndex--
    if(this.currentIndex < 0){
        this.currentIndex = this.songs.length - 1      
    }
    this.loadtCurrentSong()
},


playRandomSong:function(){
    let newIndex
    do{
    newIndex = Math.floor(Math.random() * this.songs.length)
    }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadtCurrentSong()
      
},
start:function(){
    //Gán cấu hình từ config vào ứng dụng
    this.loadConfig()
    //Định nghĩa các thuộc tính cho object
    this.defineProperties()
    //Lắng nghe và xử lý các sự kiện
    this.handleEvents() 
    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadtCurrentSong()
    //Render playlist
    this.render()
    //Hiển thị trạng thái ban đầu của button repeat và random
    randomBTN.classList.toggle('active',this.isRandom)
    repeatBTN.classList.toggle('active',this.isRepeat)
}
}
app.start()

