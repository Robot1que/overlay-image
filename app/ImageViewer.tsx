import { remote } from 'electron';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ImageInfo, ImageRepository } from "./ImageRepository";

interface State {
    
    isMenuVisible?: boolean;
    imageInfo?: ImageInfo;
    opacity: number;

}

class ImageViewer extends React.Component<{}, State> {
    private _imageInfoMap: Map<string, ImageInfo>;

    constructor() {
        super();

        this.state = {opacity: 1};
    }

    componentWillMount() {
        window.addEventListener('keydown', this._onWindowKeyPress.bind(this));

        const imageInfos = ImageRepository.ImagesGet();
        this._imageInfoMap = 
            new Map<string, ImageInfo>(
                imageInfos.map(item => [item.name, item] as [string, ImageInfo])
            );
    }

    render() {
        let select: JSX.Element | null = null;
        if (this.state.isMenuVisible || !this.state.imageInfo) {
            select = this._selectCreate();
        }

        let image: JSX.Element | null = null;
        if (this.state.imageInfo) {
            image = <img src={this.state.imageInfo.path} />
        }

        const imageOpacity = this.state.opacity ? this.state.opacity : 1;

        return <div>
            <div className="menu">
                {select}
            </div>
            <div style={{opacity: imageOpacity}}>
                {image}
            </div>
        </div>;
    }

    private _selectCreate() {
        const options = new Array<JSX.Element>();

        options.push(<option value="" key="">Choose an image</option>);

        for(const [key, imageInfo] of this._imageInfoMap.entries()) {
            options.push(
                <option key={key} value={key}>{imageInfo.name}</option>
            );
        }

        return <select 
            ref="imageSelect" 
            onChange={this._onImageSelect.bind(this)}
        >
            {options}
        </select>
    }

    private _onImageSelect() {
        const imageSelect = this.refs.imageSelect as HTMLSelectElement;
        if (imageSelect.value) {
            const imageInfo = this._imageInfoMap.get(imageSelect.value);
            if (imageInfo) {
                this.setState({ 
                    isMenuVisible: false,
                    imageInfo: imageInfo
                });
                const window = remote.getCurrentWindow();
                window.setSize(imageInfo.width, imageInfo.height);
            }
        }
    }

    private _onWindowKeyPress(event: KeyboardEvent) {
        // spacebar
        if (event.keyCode === 32) {
            this.setState({ isMenuVisible: true });
        }
        // Esc
        else if (event.keyCode === 27) {
            if (this.state.isMenuVisible) {
                this.setState({ isMenuVisible: false });
            }
            else {
                const window = remote.getCurrentWindow();
                window.close();
            }
        }
        else if (event.shiftKey && event.keyCode === 189) {
            this._imageOpacityChange(-0.1);
        }
        else if (event.shiftKey && event.keyCode === 187) {
            this._imageOpacityChange(0.1);
        }
        // else if (event.keyCode === 37) {
        //     this._windowMove(-1, 0);
        // }
        // else if (event.keyCode === 38) {
        //     this._windowMove(0, -1);
        // }
        // else if (event.keyCode === 39) {
        //     this._windowMove(1, 0);
        // }
        // else if (event.keyCode === 40) {
        //     this._windowMove(0, 1);
        // }
    }

    private _imageOpacityChange(delta: number) {
        let opacity = this.state.opacity + delta;
        
        if (opacity > 1) {
            opacity = 1;
        }
        else if (opacity < 0.1) {
            opacity = 0.1;
        }

        this.setState({ opacity: opacity });
    }

    // private _windowMove(xDelta: number, yDelta: number) {
    //     if (this.state.imageInfo) {
    //         const window = remote.getCurrentWindow();
    //         const rect = window.getBounds();
    //         window.setBounds({
    //             x: rect.x + xDelta,
    //             y: rect.y + yDelta,
    //             width: this.state.imageInfo.width,
    //             height: this.state.imageInfo.height
    //         });
    //     }
    // }

}

ReactDOM.render(
    <ImageViewer />,
    document.getElementById('root')
);