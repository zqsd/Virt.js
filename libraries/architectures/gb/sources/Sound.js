define( [

    'base',

], function ( Virtjs ) {

    var AudioContext = window.webkitAudioContext || window.AudioContext;

    return Virtjs.ClassUtil.extend( {

        initialize : function ( engine ) {

            this._engine = engine;

            this._context = new AudioContext();

            this._oscillator1 = this._context.createOscillator();
            this._oscillator1.type = 'square';
            this._oscillator1.frequency.value = 440;

            this._gain1 = this._context.createGain();
            this._gain1.connect( this._context.destination );
            this._gain1.gain.value = 0.05;

            this._oscillator1.connect( this._gain1 );
            this._oscillator1.start( 0 );


            this._oscillator2 = this._context.createOscillator();
            this._oscillator2.type = 'square';
            this._oscillator2.frequency.value = 440;

            this._gain2 = this._context.createGain();
            this._gain2.connect( this._context.destination );
            this._gain2.gain.value = 0.05;

            this._oscillator2.connect( this._gain2 );
            this._oscillator2.start( 0 );




            this._nrRamMapper_ = this._nrRamMapper.bind( this );

            this._cnt = 0;

        },

        setup : function ( ) {

            this._nrRam = new Uint8Array( 0x30 );


        },

        step : function ( ) {
            if ( this._cnt = 64 ) {
                this._cnt = 0;
                this._updateChannels();
            } else
                this._cnt++;
        },

        nrRamMapping : function ( address ) {

            return [ this._nrRamMapper_, address ];

        },

        _nrRamMapper : function ( address, value ) {

            if ( typeof value === 'undefined' )
                return this._nrRam[ address ];

            this._nrRam[ address ] = value;
            // this._updateChannels( address );

            return undefined;

        },

        _updateChannels : function ( ) {

            {
                var reg = ((this._nrRam[0x04] && 0x07) << 8) | this._nrRam[0x03];
                var frequency = 4194304 / (32 * (2048 - reg));
                this._oscillator1.frequency.value = frequency;
            }

            {
                var reg = ((this._nrRam[0x09] && 0x07) << 8) | this._nrRam[0x08];
                var frequency = 4194304 / (32 * (2048 - reg));
                this._oscillator2.frequency.value = frequency;
            }

        }
    } );
} );
