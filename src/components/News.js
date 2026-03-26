import React, { Component } from 'react'
import Newsitem from './Newsitem'
import Spinner from './Spinner';

export class News extends Component {
    constructor(){
        super();
        this.state={

            articles:[],
            loading:false,
            page:1,
            totalResults: 0,
            error: null,
            apiKeyInput: ""
        }
    }

    getApiKey = () => {
        // NOTE: This key is intentionally embedded for a frontend-only app.
        // If you want to keep keys private, use a backend proxy instead.
        const fallbackHardcodedKey = "e5a75bad3e3e40f0b9b9ac88679d4697";
        return process.env.REACT_APP_NEWS_API_KEY || fallbackHardcodedKey;
    }

    saveApiKey = async () => {
        const k = (this.state.apiKeyInput || "").trim();
        if (!k) return;
        localStorage.setItem("NEWS_API_KEY", k);
        this.setState({ apiKeyInput: "", error: null });
        await this.fetchPage(1);
    }

    fetchPage = async (page) => {
        const pageSize = String(this.props.pageSize);
        const endpoint = (this.props.query && this.props.query.trim().length > 0) ? "everything" : "top-headlines";

        const cacheKey = JSON.stringify({
            endpoint,
            page,
            pageSize,
            category: this.props.category || "general",
            query: (this.props.query || "").trim(),
            country: "us"
        });

        const now = Date.now();
        const cacheTtlMs = 3 * 60 * 1000;

        try {
            const cachedRaw = sessionStorage.getItem(cacheKey);
            if (cachedRaw) {
                const cached = JSON.parse(cachedRaw);
                if (cached?.ts && (now - cached.ts) < cacheTtlMs && cached?.data) {
                    this.setState({
                        articles: cached.data.articles || [],
                        totalResults: cached.data.totalResults || 0,
                        page,
                        loading: false,
                        error: null
                    });
                }
            }
        } catch {
            // ignore cache errors
        }

        this.setState({ loading: true, error: null });
        try {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("pageSize", pageSize);

            let url = "";
            if (endpoint === "everything") {
                params.set("q", this.props.query.trim());
                url = `/api/everything?${params.toString()}`;
            } else {
                params.set("category", this.props.category || "general");
                url = `/api/top-headlines?${params.toString()}`;
            }

            const data = await fetch(url);
            const contentType = data.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) {
                const text = await data.text();
                if (text && text.startsWith("<!DOCTYPE")) {
                    throw new Error("Backend not running. Start with: npm run dev");
                }
                throw new Error("Unexpected response from server.");
            }
            const parsedData = await data.json();
            if (!data.ok) {
                throw new Error(parsedData?.message || parsedData?.error || "Request failed");
            }

            try {
                sessionStorage.setItem(cacheKey, JSON.stringify({ ts: now, data: parsedData }));
            } catch {
                // ignore cache errors
            }
            this.setState({
                articles: parsedData.articles || [],
                totalResults: parsedData.totalResults || 0,
                page,
                loading: false
            });
        } catch (e) {
            this.setState({
                loading: false,
                error: e?.message || "Failed to load news"
            });
        }
    }
    async componentDidMount(){
        await this.fetchPage(1);
        }

        async componentDidUpdate(prevProps){
            if (
                prevProps.category !== this.props.category ||
                prevProps.query !== this.props.query ||
                prevProps.pageSize !== this.props.pageSize
            ) {
                await this.fetchPage(1);
            }
        }

        handlePreClick=async ()=>{
            await this.fetchPage(this.state.page - 1);
        }
        handleNextClick=async ()=>{
            if ( this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)){
            }else{
                await this.fetchPage(this.state.page + 1);
            }
            
        }

    render() {
        return (
            <div className='container my-4'>
                <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
                    <div>
                        <h2 className='mb-0'>ThunderNews</h2>
                        <div className="text-muted small">
                            {this.props.query && this.props.query.trim().length > 0
                                ? <>Search: <span className="fw-semibold">{this.props.query}</span></>
                                : <>Category: <span className="fw-semibold text-capitalize">{this.props.category || "general"}</span> • Country: <span className="fw-semibold text-uppercase">US</span></>
                            }
                        </div>
                    </div>
                    <div className="text-muted small">
                        {this.state.totalResults ? `${this.state.totalResults.toLocaleString()} results` : ""}
                    </div>
                </div>
                {this.state.loading && <Spinner/>}
                {this.state.error && (
                    <div className="alert alert-warning" role="alert">
                        {this.state.error}
                    </div>
                )}
                
                <div className="row my-3">
                {this.state.articles.map((element)=>{
                           return <div className="col-md-4" key={element.url}>
                            <Newsitem
                                title={element.title?element.title.slice(0,80):""}
                                description={element.description?element.description.slice(0,140):""}
                                imageUrl={element.urlToImage}
                                newsurl={element.url}
                                author={element.author}
                                publishedAt={element.publishedAt}
                                source={element.source?.name}
                            />
                            </div>
                        })}
                   
                </div>
                <div className="container d-flex justify-content-between">
                <button disabled={this.state.loading || this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePreClick}>&larr; Previous</button>
                <button disabled={this.state.loading || this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>
            </div>
        )
    }
}

export default News
