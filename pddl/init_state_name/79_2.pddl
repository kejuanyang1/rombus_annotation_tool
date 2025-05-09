(define (problem scene1)
  (:domain manip)
  (:objects
    red chili pepper - item
    purple jello box - support
    yellow jello box - support
    white tape - item
    big yellow shopping basket - container
    blue basket - container
  )
  (:init
    (ontable red chili pepper)
    (ontable white tape)
    (in purple jello box big yellow shopping basket)
    (in yellow jello box blue basket)
    (closed big yellow shopping basket)
    (closed blue basket)
    (handempty)
    (clear red chili pepper)
    (clear white tape)
  )
  (:goal (and ))
)