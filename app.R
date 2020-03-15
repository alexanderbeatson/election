
library(shiny)
library(shinythemes)
library(shinyWidgets)
library(r2d3)
library(htmlwidgets)
library(readr)
library(ggplot2)
library(dplyr)
library(ggthemes)
library(DT)
x = NULL
d3js <- 'src="https://d3js.org/d3.v5.js"'
elect <- readRDS("./elect.rds")

parliData <- "{'2015': [{'Held on':'8 Nov 2015','Available seats':'1557','President':'Htin Kyaw', 'link':'https://en.wikipedia.org/wiki/Htin_Kyaw','sauce':'https://en.wikipedia.org/wiki/2015_Myanmar_general_election'}],
  '2010':[{'Held on':'7 Nov 2010','Available seats':'1544','President':'Thein Sein', 'link':'https://en.wikipedia.org/wiki/Thein_Sein','sauce':'https://en.wikipedia.org/wiki/2010_Myanmar_general_election'}],
  '2012':[{'Held on':'1 April 2012','Available seats':'48','President':'Thein Sein', 'link':'https://en.wikipedia.org/wiki/Thein_Sein','sauce':'https://en.wikipedia.org/wiki/2012_Myanmar_by-elections'}],
  '2017':[{'Held on':'1 Apr 2017','Available seats':'19','President':'Htin Kyaw', 'link':'https://en.wikipedia.org/wiki/Htin_Kyaw','sauce':'https://en.wikipedia.org/wiki/2017_Myanmar_by-elections'}],
  '2018':[{'Held on':'3 Nov 2018','Available seats':'13','President':'Win Myint', 'link':'https://en.wikipedia.org/wiki/Win_Myint_(politician,_born_1951)','sauce':'https://en.wikipedia.org/wiki/2018_Myanmar_by-elections'}]}"
parliData <- gsub("QUUX", "'", gsub("'", '"', gsub('"', "QUUX", parliData)))
RparliData <- rjson::fromJSON(parliData, simplify = T)
elect <- readRDS("./elect.rds")


ui <- fluidPage(
  theme = shinytheme("slate"),
  fluidRow(
    tags$script(d3js),
    tags$head(tags$link(rel="shortcut icon", href="/favicon.ico")),
    tags$div(titlePanel("Myanmar Election Dashboard"), style="display:inline-block;width:100%;text-align: center;margin: 1%"),
    tags$p("Election dashboard introduces Myanmar's first complete dataset of election results originally compiled by the Tech for Change team at Phandeeyar. The data is available for download under a Creative Commons license. This web application is under development.", align = "center", style = "margin-left : 5%; margin-right: 5%; margin-top: 2%;"),
    div(style="display:inline-block;width:100%;text-align: center;margin: 2%",tags$a(class="btn btn-default", href="https://opendevelopmentmyanmar.net/dataset/?id=election-result-data", target = "_blank", "Download Data"))
  ),
   #--------------------------------------
   # Sidebar ---- Year selection
   sidebarLayout(
      sidebarPanel(
         tags$p("General election", div(actionGroupButtons(c("Year2010","Year2015"),labels = c("2010","2015")), style = "text-align: center"),style="display:inline-block;width:100%;text-align: center;margin: 1%"),
         tags$p("By-election", div(actionGroupButtons(c("Year2012","Year2017","Year2018"),labels = c("2012","2017","2018")), style = "text-align: center"), style="display:inline-block;width:100%;text-align: center;margin: 1%"),
         div(htmlOutput("YearInfo"), htmlOutput("heldon"), htmlOutput("seats"),htmlOutput("president"), style = "text-align: center;"),
         width = 3
      ),
      
      # Show a plot of the generated distribution
      mainPanel(
          column(6,div(tags$p("Top 10 parties by number of candidates"),d3Output("parChart",height = "auto", width = "100%")), style = "text-align: center;"),
        column(6,div(tags$p("Position in parliament"), d3Output("parliament",height = "auto", width = "100%")), style = "text-align: center;")
      )
   ),
  sidebarLayout(
    sidebarPanel(uiOutput("house"), uiOutput("state"), uiOutput("const"), width = 3),
    mainPanel(dataTableOutput("constTable"), plotOutput("pie", width = "auto"))
  ),
  hr(),
  tags$div("This web application is built using", tags$a("href" = "https://www.r-project.org", "R"), ",", tags$a("href" = "https://shiny.rstudio.com/", "Shiny"), "and", tags$a("href" = "https://d3js.org/", "D3.js"), "by", tags$a("href" = "https://alexbeatson.me", "Alexander Beatson"), "with the support buddy", tags$a("href"="https://www.linkedin.com/in/hsu-phyu-2bb654166/","Hsu Hla Phyu"), ".", style = "text-align : center")
   
)

# Define server logic required to draw a histogram
server <- function(input, output) {
  electYear = reactiveValues(year = "2010", house = "amyo", state = "Yangon", const = subset(elect[["yr2010"]][["amyo"]], name_st == "Yangon")$const_name[1])
  observeEvent(input$Year2010,{
    electYear$year <- "2010"
  })
  observeEvent(input$Year2012, {
    electYear$year <- "2012"
  })
  observeEvent(input$Year2015, {
    electYear$year <- "2015"
  })
  observeEvent(input$Year2017, {
    electYear$year <- "2017"
  })
  observeEvent(input$Year2018, {
    electYear$year <- "2018"
  })
  observeEvent(input$state, {
    electYear$state <- input$state
  })
  observeEvent(input$house, {
    electYear$house <- input$house
  })
  observeEvent(input$const, {
    electYear$const <- input$const
  })
   output$parChart <- renderD3({
     r2d3(data=electYear$year,  script = "./www/barchart.js")
   })
   output$parliament <- renderD3({
     r2d3(data=electYear$year,  script = "./www/parliament.js")
   })
   output$YearInfo <- renderText({
     paste("Year : ", electYear$year)
   })
   output$heldon <- renderText({
     paste("Held on : ", "<a href='", RparliData[[electYear$year]][[1]][[5]], "' target = '_blank'>", RparliData[[electYear$year]][[1]][[1]], "</a>")
   })
   output$seats <- renderText({
     paste("Available seats : ", RparliData[[electYear$year]][[1]][[2]])
   })
   output$president <- renderText({
     paste("President : ", "<a href='", RparliData[[electYear$year]][[1]][[4]], "' target = '_blank'>", RparliData[[electYear$year]][[1]][[3]], "</a>")
   })
   output$house <- renderUI ({
     selectInput("house","House", c("Amyotha" = "amyo", "Pyithu" = "pyithu", "State and Region" = "sr"))
    #names(elect[[paste0("yr",electYear$year)]])
   })
   output$state <- renderUI ({
     selectInput("state","State", unique(elect[[paste0("yr",electYear$year)]][[electYear$house]]$name_st))
   })
   output$const <- renderUI ({
     selectInput("const", "Constituency", unique(subset(elect[[paste0("yr",electYear$year)]][[electYear$house]], name_st == electYear$state)$const_name))
   })
   output$constTable <- renderDataTable({
     electTable <- elect[[paste0("yr",electYear$year)]][[electYear$house]] %>% filter(name_st == electYear$state ) %>% filter (const_name == electYear$const) %>%  select (name_st, const_code, const_name,  candidate_name.my, party_name.en, votes.total_valid)#Do not use filter one time with & for multiple conditions here, 
     names(electTable) <- c("State","Constituency code","Constituency","Candidate name","Party name","Total votes")
     datatable(electTable, style = "bootstrap")
   })
   output$pie <- renderPlot({
     electTable <- elect[[paste0("yr",electYear$year)]][[electYear$house]] %>% filter(name_st == electYear$state ) %>% filter (const_name == electYear$const) %>%  select (name_st, const_code, const_name,  candidate_name.my, party_name.en, votes.total_valid) %>% mutate (freq = as.numeric(votes.total_valid)/sum(as.numeric(votes.total_valid))*100)
     electPlot %>% ggplot (aes(x = "",y = freq, fill = party_name.en)) + geom_bar (width = 1, stat = "identity") + coord_polar(theta = "y", start = 0) + theme_solarized(light = F) + labs (x = "", y = "", fill = "Party name") 
   })
}

# Run the application 
shinyApp(ui = ui, server = server)

