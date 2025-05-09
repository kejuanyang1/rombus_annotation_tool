(define (problem scene1)
  (:domain manip)
  (:objects
    small red triangular prism_1 small red triangular prism_2 red cylinder small yellow triangular prism - item
    long blue block_1 long blue block_2 long green block - support
    yellow basket - container
  )
  (:init
    (ontable small red triangular prism_1)
    (ontable small red triangular prism_2)
    (ontable red cylinder)
    (ontable small yellow triangular prism)
    (ontable long blue block_1)
    (ontable long blue block_2)
    (ontable long green block)
    (ontable yellow basket)
    (clear small red triangular prism_1)
    (clear small red triangular prism_2)
    (clear red cylinder)
    (clear small yellow triangular prism)
    (clear long blue block_1)
    (clear long blue block_2)
    (clear long green block)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)