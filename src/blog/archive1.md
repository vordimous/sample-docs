---
date: 1998-01-01
cover: blog-6-cover@2x.png
category:
  - History
tag:
  - WWI
archive: true
---

# Streaming APIs and Protocols: SSE, WebSocket, MQTT, AMQP, gRPC
--------------------------------------------------------------

Let's take a look at popular streaming APIs and protocols and describe their use-cases, strengths, and shortcomings.

<!-- more -->

![](https://uploads-ssl.webflow.com/60e49b51af3305de5fc286cc/63f67e870c804fd264fd39b1_blog-6-cover%402x.png)
![](https://uploads-ssl.webflow.com/60e49b51af3305de5fc286cc/63ed90f878471163b6892876_aklivity-icon-green-gradient%402x.png)

Gints Dreimanis

Guest

REST is the most prevalent type of API on the internet, but it’s not fit for every use case.

In a REST architecture, there are two parties: clients and the server. Clients request information, and the server responds to their requests. This makes it hard for the server to take the initiative and push updates to the client.

There are solutions to overcome this weakness. The server can either repeatedly ask for updates (short polling) or ask for an update and wait until the response arrives (long polling). But these are crutches, trying to introduce server-side updates into a model that doesn’t really support them.

A much more efficient solution is to use a streaming API instead. Streaming APIs use a push-based model, where data is sent to the client once it’s available instead of being sent on request.

This article covers five APIs/protocols that are reliable, scalable, and commonly supported by cloud vendors. They are the gold standard in their areas, so if your use case requires streaming data, you should definitely check them out.

The first two are commonly used for communication between the client and the server, while the other three are more commonly used for communicating between different backend services, such as devices or microservices.

SSE
---

There are two popular ways of streaming messages from a server to a client: server-sent events (SSE) and WebSocket.

With[SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events), the client uses JavaScript’s[EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)interface to subscribe to a stream on a server. The server can then send a continuous stream of messages (events) to that client.

![SSE pictured](https://uploads-ssl.webflow.com/60e49b51af3305de5fc286cc/63f660b3f515222d7f897f05_dc1iggq.png)

Messaging in SSE is unidirectional—only the server can send the messages through the stream. Meanwhile, if the client wants to send a message to the server, it can send a different request, but it will be separate from the stream and won’t automatically share its state.

While the direction requirement might seem limiting, it also makes the technology quite simple and efficient. SSE works on top of HTTP, meaning that you can utilize various HTTP conveniences such as easy dealing with proxies and compression. It also supports automatic reconnection out-of-box, which can be very useful.

Its simplicity also makes it easy to scale. Need to serve more users with server-sent events? Add more servers and a load balancer in the middle, and you’re done. Major cloud vendors’ regular offerings also easily support server-sent events.

SSE is the best option when you have continuously updating real-time text data that you need to display to the client (logging, stock data, live feed). While you can technically implement something bidirectional like a chat application through SSE, it’s not ideal for this use case since you’ll need two separate streams (client -> server, server -> client), state of which will somehow need to be synchronized.

If you want to either stream binary data to the client or have bidirectional communication with the client, you’ll be better suited to use a more complex technology such as WebSocket.

WebSocket
---------

[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)is a bidirectional, full-duplex protocol for communication between a client and a server over the web. Importantly, it enables two parties to exchange messages with each other at the same time.

In contrast to SSE, which works on top of HTTP, WebSocket is an entirely different protocol. Like HTTP, the WebSocket protocol is built on top of[TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol).

In HTTP/1.1, to start using the WebSocket protocol, the client and server need to go through what’s called the WebSocket handshake.

The client initiates the handshake with a request to upgrade the protocol from HTTP to WebSocket. If the server accepts the request, both parties can use the socket to send each other messages.

![WebSocket](https://uploads-ssl.webflow.com/60e49b51af3305de5fc286cc/63f660b3a644eb31dca540fd_cpB22a0.png)

WebSocket can also be bootstrapped from HTTP/2. In this case, the HTTP CONNECT method is used to embed a WebSocket inside the HTTP/2 stream.

WebSocket is much more efficient than HTTP-only solutions for bidirectional communication like short polling and long polling. It eliminates some of the latency problems that arise from polling and significantly reduces message payloads due to the absence of HTTP headers.

Between SSE and WebSocket, WebSocket is definitely the more popular technology, as it’s much less restrictive. However, using a different protocol than HTTP does have its drawbacks.

WebSocket is more complex than HTTP, and you also don’t get any niceties, such as automatic connection recovery, text compression, caching, etc. If you want these capabilities for WebSocket, you need to transfer extra JavaScript code to the client that implements them since they are not built into browsers by default.

It’s also usually more difficult to scale the WebSocket API than a regular request-response API. Typically, WebSocket is used for interactive things like chat apps, and simply routing people to different servers with the load balancer will not help there. You need to make the servers communicate with each other to deliver messages (which can be done with the next two protocols in this article).

In general, WebSocket is one of the best choices if you need bidirectional communication between two actors, such as a client and a server or two clients (connected via server). But if you only need to stream data from the server to the client, SSE will be more than good enough.

MQTT
----

In the previously described protocols, a server usually communicates with a client that’s a web browser. However, this method is not ideal if you have a set of many services, all wanting to send and get information from each other. This leads to a lot of messages and also tightly couples the systems, which could lead to scaling difficulties and cascading failures.

Architectures that follow the[message queue](https://aws.amazon.com/message-queue/)or[pub/sub](https://cloud.google.com/pubsub/docs/overview)(short for publish/subscribe) models are much better suited to use cases with any nontrivial amount of services.

[MQTT](https://mqtt.org/)is a lightweight pub/sub system initially made for devices that don’t have a lot of processing power or network bandwidth.

So what exactly is a pub/sub system? MQTT consists of three different kinds of actors: publishers, subscribers, and a central server—the broker.

Publishers send messages to the broker in channels that are called topics, subscribers can subscribe to any topics that are relevant, and the broker acts as a post office that ensures messages reach everyone they need to reach. An actor doesn’t necessarily need to be either a publisher or a subscriber; it can be both.

![MQTT](https://uploads-ssl.webflow.com/60e49b51af3305de5fc286cc/63f660b3374d1e0fa05a9d24_QD49YnY.png)

Since every node (publisher or subscriber) is connected to the broker, every node is technically connected to each other. For example, devices in an[IoT](https://en.wikipedia.org/wiki/Internet_of_things)setting can send their measurement data and receive changes in configuration and other signals. The broker takes care of distributing the messages to the correct devices.

At the same time, the components of the system are loosely coupled. Nodes don’t really need to know about or directly interact with other nodes.

Today, MQTT is used for smart devices in industries like manufacturing, telecommunications, and oil and gas. But smart device interactions are not its only use case. For example, it’s used by Facebook in[Facebook Messenger](https://engineering.fb.com/2011/08/12/android/building-facebook-messenger/)because it’s battery-friendly for mobile devices.

Pub/sub architectures like the one used by MQTT have many benefits: they are great for microservices, each service is loosely coupled, and they enable work to happen asynchronously.

MQTT also enables you to choose your own level of message delivery reliability according to your use case. The three possible options for quality of service (QoS) are:

*   Messages are delivered at most once
*   Messages are delivered at least once
*   Messages are delivered once and once only

The scalability of MQTT is different across implementations, with industry-grade broker implementations like HiveMQ reportedly handling[10 million clients](https://www.hivemq.com/benchmark-10-million/).

While MQTT uses plain TCP underneath, it’s possible to use it over WebSocket. This enables browser clients or IoT devices to communicate via standard HTTP ports, which evades issues with firewalls. This does introduce some extra overhead in exchange for a simpler solution.

The MQTT protocol is supported by major cloud vendors through their IoT offerings.

AMQP
----

[Advanced Message Queuing Protocol](https://www.amqp.org/)(AMQP) is similar to MQTT but has more features as it caters to more advanced devices.

It was first developed as an open standard for enterprise solutions in certain areas by a working group of representatives from companies like JPMorgan Chase, Cisco Systems, and Red Hat.

It has two major (and incompatible!) versions: 0.9.1 and 1.0. The first is much more connected to the message broker architecture discussed earlier in this article, while the second is a “rewrite” of the protocol that tries to be more abstract and cover all kinds of message-based interactions between various devices.

This article focuses on the 0.9.1 version of this protocol as it’s used by many popular message broker implementations. For example, it was the impetus behind the creation of[RabbitMQ](https://www.rabbitmq.com/), one of the most widely used open source message brokers.

According to the[specification](https://www.rabbitmq.com/resources/specs/amqp0-9-1.pdf), the goal of AMQP is to create “full functional interoperability between conforming clients and messaging middleware servers.”

It does this by defining the semantics of server-side services (such as what components an AMQP system should have and how they should interact) and a common wire-level protocol that enables clients to interact with these services.

The AMQP 0.9.1 specification prescribes an architecture with publisher applications that send messages to a middleware server and consumer applications that receive messages from it.

The middleware server itself does two main things: it routes the messages to consumers that need to receive them and prevents them from moving on before they are consumed.

Unlike MQTT, the specification prescribes to split the work of the server into two parts: exchange, which aims to receive and sort the messages, and message queue, which stores them and forwards them to the consumers. There is a clear interface between these two that’s called a binding.

![AMQP](https://uploads-ssl.webflow.com/60e49b51af3305de5fc286cc/63f660b32614ee77b152dd75_CKYEmWV.png)

There are various types of exchanges, such as direct, topic, fanout, and header, which enable developers to implement more routing patterns than are possible in MQTT.

In general, if you pick AMQP instead of MQTT, you’re trading off deploying a more complex system to make use of its more advanced capabilities. If you need a simple message broker, MQTT might be enough.

Similarly to MQTT, scalability depends on the implementation.

Also, same as MQTT, AMQP can be used over WebSockets to reuse standard HTTP ports instead of opening ports through network firewalls.

Major cloud vendors support deploying a message broker that uses AMQP 0.9.1 underneath, like RabbitMQ. Azure Service Bus also supports the 1.0 version of the protocol.

gRPC
----

[gRPC](https://grpc.io/)is an open source framework created by Google that’s usually used to connect and transfer information between microservices.

Before the release of gRPC, Stubby was used to power communication between Google’s microservices. In 2015, Google standardized and open sourced it as gRPC. Currently, gRPC is governed by the Cloud Native Computing Foundation.

It’s typically used to connect backend microservices written in multiple different languages. Essentially, it enables developers to create remote procedure call (RPC) APIs via[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2).

RPC is an old style of API where you basically just call functions (procedures), except those function calls happen on a remote machine, not on your computer. In gRPC, special files called[protocol buffers](https://developers.google.com/protocol-buffers)are used to define the interface of a microservice in terms of what procedures can be called and the schema of its data.

Each gRPC server contains the implementation of these methods, while each client has something that’s called a stub or a gRPC client: a list of which methods are available for it to call on this server.

The protocol buffer files are used to automatically generate a class that will serialize and deserialize messages created by this microservice according to the specification. Due to efficient serialization, the payload of gRPC messages is very small. Protocol buffers also serve as the common language between services written in various languages.

![gRPC](https://uploads-ssl.webflow.com/60e49b51af3305de5fc286cc/63f660b4f2ec725064074420_OThkGsx.png)

HTTP/2 supports client, server, and bidirectional streaming, so all of these are also available with gRPC. This makes it much better than regular HTTP/1.1-based REST solutions. You’ll have lower network latency and be able to serve more requests.

When you compare the underlying protocols, there is not a lot that is inherently better with RPC than REST performance wise. But gRPC, the framework, is very efficient and optimized.

If you compare a gRPC and a regular HTTP/2-based REST solution, gRPC will most likely be the better choice because the framework uses HTTP/2 features very efficiently, something that would be very hard to mirror for a regular team working on a REST solution.

In addition, compressing protobufs is more efficient than compressing message formats popular in REST solutions like JSON.

And since it is quite simple, it can be used in many ways. It provides significant benefits when building large-scale systems, as well as in mobile clients where network payload size is important.

However, it’s not a magic bullet for large systems. You could use it to implement a pub/sub protocol like the ones covered earlier in the article, but you would still need to solve for scaling—gRPC cannot make a bad architecture work by itself.

Additionally, gRPC doesn’t work natively in the browser, so there is no benefit in making a gRPC service for simple applications that plan to use web browsers as the client.

gRPC is a standard solution for microservices, so it’s supported by cloud vendors like AWS, Azure, and Google Cloud.

Conclusion
----------

This article covered five protocols that you can use to replace a standard REST API when you need to add streaming.

Some of these solutions work better for interactions between a backend server and a web browser, such as those happening on a web app that displays real-time stock data or that hosts chats. Others are more suited for interactions between devices in an IoT setting or between different microservices on a backend.

As always, there’s no single best solution to choose. To pick the most suitable one, you should analyze what tradeoffs each solution makes and pick the one that fits your use case the best.

‍

[

![](https://uploads-ssl.webflow.com/60e49b51af3305d435c286ab/60e5ccc87b788a14e3f61b6b_Slack_Mark_Monochrome_Green.svg)

#### Join our Slack Workspace





](https://join.slack.com/t/aklivitycommunity/shared_invite/zt-sy06wvr9-u6cPmBNQplX5wVfd9l2oIQ)

##### Subscribe to our newsletter

Thank you! Your submission has been received!

Oops! Something went wrong while submitting the form.

[![](https://uploads-ssl.webflow.com/60e49b51af3305d435c286ab/60e78065113f2f12904a43b1_aklivity-logo.svg)‍](/old-home)

Stream Data Anywhere.
---------------------

[](https://github.com/aklivity/zilla)