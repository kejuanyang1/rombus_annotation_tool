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
    (ontable purple jello box)
    (ontable yellow jello box)
    (ontable blue basket)
    (in white tape big yellow shopping basket)
    (closed big yellow shopping basket)
    (clear red chili pepper)
    (clear purple jello box)
    (clear yellow jello box)
    (clear blue basket)
    (handempty)
  )
  (:goal (and ))
)