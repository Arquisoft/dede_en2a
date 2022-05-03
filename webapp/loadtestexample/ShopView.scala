package dede

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class ShopView extends Simulation {

  private val httpProtocol = http
    .baseUrl("https://20.25.24.200:3000")
    .inferHtmlResources(AllowList(), DenyList())
    .acceptHeader("image/avif,image/webp,*/*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0")
  
  private val headers_0 = Map(
  		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  		"Upgrade-Insecure-Requests" -> "1"
  )
  
  private val headers_1 = Map(
  		"If-Modified-Since" -> "Tue, 03 May 2022 15:57:50 GMT",
  		"If-None-Match" -> """W/"2d9cb-1808aa46030""""
  )


  private val scn = scenario("ShopView")
    .exec(
      http("request_0")
        .get("/shop")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("/static/media/dede_logo.c034999eb8d5cde2ffa4.svg")
            .headers(headers_1)
        )
    )

	setUp(scn.inject(constantUsersPerSec(20).during(10))).protocols(httpProtocol)
}
