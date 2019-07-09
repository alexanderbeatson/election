
library(shiny)
library(shinythemes)
library(shinyWidgets)
library(r2d3)
library(htmlwidgets)
x = NULL
d3js <- 'src="https://d3js.org/d3.v5.js"'

parliData <- "{'2015': [{'Held on':'8 Nov 2015','Available seats':'1557','President':'Htin Kyaw', 'link':'https://en.wikipedia.org/wiki/Htin_Kyaw','sauce':'https://en.wikipedia.org/wiki/2015_Myanmar_general_election'}],
  '2010':[{'Held on':'7 Nov 2010','Available seats':'1544','President':'Thein Sein', 'link':'https://en.wikipedia.org/wiki/Thein_Sein','sauce':'https://en.wikipedia.org/wiki/2010_Myanmar_general_election'}],
  '2012':[{'Held on':'1 April 2012','Available seats':'48','President':'Thein Sein', 'link':'https://en.wikipedia.org/wiki/Thein_Sein','sauce':'https://en.wikipedia.org/wiki/2012_Myanmar_by-elections'}],
  '2017':[{'Held on':'1 Apr 2017','Available seats':'19','President':'Htin Kyaw', 'link':'https://en.wikipedia.org/wiki/Htin_Kyaw','sauce':'https://en.wikipedia.org/wiki/2017_Myanmar_by-elections'}],
  '2018':[{'Held on':'3 Nov 2018','Available seats':'13','President':'Win Myint', 'link':'https://en.wikipedia.org/wiki/Win_Myint_(politician,_born_1951)','sauce':'https://en.wikipedia.org/wiki/2018_Myanmar_by-elections'}]}"
parliData <- gsub("QUUX", "'", gsub("'", '"', gsub('"', "QUUX", parliData)))
RparliData <- rjson::fromJSON(parliData, simplify = T)


ui <- fluidPage(
  tags$script(d3js),
  tags$script("window.onload = function () {d3.select('body').append('p').text('testing');}"),
  tags$head(tags$link(rel="shortcut icon", href="/favicon.ico")),
   fluidPage(theme = shinytheme("slate")),
   tags$div(titlePanel("Myanmar Election Dashboard"), style="display:inline-block;width:100%;text-align: center;margin: 1%"),
   tags$p("Election dashboard introduces Myanmar's first complete dataset of election results originally compiled by the Tech for Change team at Phandeeyar. The data is available for download under a Creative Commons license. This web application is under development.", align = "center", style = "margin-left : 5%; margin-right: 5%; margin-top: 2%;"),
   div(style="display:inline-block;width:100%;text-align: center;margin: 2%",tags$a(class="btn btn-default", href="https://opendevelopmentmyanmar.net/dataset/?id=election-result-data", target = "_blank", "Download Data")),
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
    sidebarPanel(width = 3),
    mainPanel()
  ),
  hr(),
  tags$div("This web application is built using", tags$a("href" = "https://www.r-project.org", "R"), ",", tags$a("href" = "https://shiny.rstudio.com/", "Shiny"), "and", tags$a("href" = "https://d3js.org/", "D3.js"), "by", tags$a("href" = "https://alexbeatson.me", "Alexander Beatson"), "with the support buddy", tags$a("href"="https://www.linkedin.com/in/hsu-phyu-2bb654166/","Hsu Hla Phyu"), ".", style = "text-align : center")
   
)

# Define server logic required to draw a histogram
server <- function(input, output) {
  electYear = reactiveValues(data = "2010")
  screenWidth = reactiveValues(data = NULL)
  observeEvent(input$Year2010, {
    electYear$data <- "2010"
  })
  observeEvent(input$Year2012, {
    electYear$data <- "2012"
  })
  observeEvent(input$Year2015, {
    electYear$data <- "2015"
  })
  observeEvent(input$Year2017, {
    electYear$data <- "2017"
  })
  observeEvent(input$Year2018, {
    electYear$data <- "2018"
  })
   output$parChart <- renderD3({
     r2d3(data=electYear$data,  script = "./www/barchart.js")
   })
   output$parliament <- renderD3({
     r2d3(data=electYear$data,  script = "./www/parliament.js")
   })
   output$YearInfo <- renderText({
     paste("Year : ", electYear$data)
   })
   output$heldon <- renderText({
     paste("Held on : ", "<a href='", RparliData[[electYear$data]][[1]][[5]], "' target = '_blank'>", RparliData[[electYear$data]][[1]][[1]], "</a>")
   })
   output$seats <- renderText({
     paste("Available seats : ", RparliData[[electYear$data]][[1]][[2]])
   })
   output$president <- renderText({
     paste("President : ", "<a href='", RparliData[[electYear$data]][[1]][[4]], "' target = '_blank'>", RparliData[[electYear$data]][[1]][[3]], "</a>")
   })
}

# Run the application 
shinyApp(ui = ui, server = server)

